  const CONFIG = {
    SPREADSHEET_ID: "1Mdie27xg-ss2q0mqySVo0ObvMnrnCeQ3IKAvsX6AiMM/",
    SHEET_NAME: "AsiaEuro Enrollment Spreadsheet",
    UPLOAD_FOLDER_ID: "https://drive.google.com/drive/folders/1yYYtNSVqXjq9i8J3QKRbXmySllBSrTJW?usp=sharing"
  };

  function doGet() {
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        message: "AsiaEuro Enrollment API is running."
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  function doPost(e) {
    try {
      if (!e || !e.postData || !e.postData.contents) {
        throw new Error("No submission data received.");
      }

      const payload = JSON.parse(e.postData.contents);
      validatePayload_(payload);

      const folder = DriveApp.getFolderById(CONFIG.UPLOAD_FOLDER_ID);
      const qidUrl = saveFile_(folder, payload.qidFile, payload.fullName, "QID");
      const passportUrl = saveFile_(folder, payload.passportFile, payload.fullName, "Passport");

      const sheet = getOrCreateSheet_();
      ensureHeaders_(sheet);

      sheet.appendRow([
        new Date(),
        payload.fullName,
        payload.course,
        payload.email,
        payload.phone,
        payload.birthDate,
        payload.nationality,
        payload.gender,
        payload.homeAddress,
        payload.education,
        payload.yearCompleted,
        payload.employmentStatus,
        payload.referralSource,
        payload.preferredSchedule,
        payload.emergencyName,
        payload.relationship,
        payload.emergencyPhone,
        payload.emergencyAddress,
        qidUrl,
        passportUrl,
        payload.agreementAccepted ? "Yes" : "No",
        payload.signatureName,
        payload.paymentAcknowledged ? "Yes" : "No"
      ]);

      return jsonResponse_({
        ok: true,
        message: "Enrollment saved successfully."
      });

    } catch (error) {
      console.error(error);
      return jsonResponse_({
        ok: false,
        error: error.message || "Unknown server error."
      });
    }
  }

  function validatePayload_(payload) {
    const required = [
      "fullName",
      "course",
      "email",
      "phone",
      "birthDate",
      "nationality",
      "gender",
      "homeAddress",
      "education",
      "yearCompleted",
      "emergencyName",
      "relationship",
      "emergencyPhone",
      "signatureName"
    ];

    required.forEach(function(field) {
      if (!payload[field] || String(payload[field]).trim() === "") {
        throw new Error("Missing required field: " + field);
      }
    });

    if (!payload.agreementAccepted) {
      throw new Error("The Student Enrollment Agreement must be accepted.");
    }

    if (!payload.paymentAcknowledged) {
      throw new Error("Payment confirmation must be acknowledged.");
    }

    if (!payload.qidFile || !payload.qidFile.base64) {
      throw new Error("QID copy is required.");
    }
  }

  function getOrCreateSheet_() {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
    }

    return sheet;
  }

  function ensureHeaders_(sheet) {
    if (sheet.getLastRow() > 0) return;

    sheet.appendRow([
      "Timestamp",
      "Full Name",
      "Course",
      "Email",
      "Phone",
      "Date of Birth",
      "Nationality",
      "Gender",
      "Home Address",
      "Educational Attainment",
      "Year Completed / Last Attended",
      "Employment Status",
      "Referral Source",
      "Preferred Schedule",
      "Emergency Contact Name",
      "Relationship",
      "Emergency Phone",
      "Emergency Address",
      "QID File",
      "Passport File",
      "Agreement Accepted",
      "Electronic Signature",
      "Payment Acknowledged"
    ]);

    sheet.getRange(1, 1, 1, sheet.getLastColumn())
      .setFontWeight("bold")
      .setBackground("#023E8A")
      .setFontColor("#FFFFFF");

    sheet.setFrozenRows(1);
  }

  function saveFile_(folder, fileData, fullName, documentType) {
    if (!fileData || !fileData.base64) return "";

    const safeName = String(fullName).replace(/[^\w\- ]/g, "").trim();
    const originalName = String(fileData.name || documentType);
    const extensionMatch = originalName.match(/(\.[A-Za-z0-9]+)$/);
    const extension = extensionMatch ? extensionMatch[1] : "";

    const filename =
      Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss") +
      " - " + safeName + " - " + documentType + extension;

    const bytes = Utilities.base64Decode(fileData.base64);
    const blob = Utilities.newBlob(
      bytes,
      fileData.type || "application/octet-stream",
      filename
    );

    const file = folder.createFile(blob);
    return file.getUrl();
  }

  function jsonResponse_(data) {
    return ContentService
      .createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }
