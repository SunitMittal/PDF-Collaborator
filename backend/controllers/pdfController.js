const PDF = require("../models/PDF");
const crypto = require("crypto");
const { sendShareEmail } = require("../utils/emailService");

exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const pdf = new PDF({
      user: req.user.id,
      fileName: req.file.originalname,
      fileUrl: req.file.location,
    });

    await pdf.save();
    console.log("✅ PDF Uploaded & Saved:", pdf);

    res.status(201).json({ message: "PDF uploaded successfully", pdf });
  } catch (error) {
    console.error("❌ Error saving PDF:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


exports.getUserPDFs = async (req, res) => {
  try {
    const pdfs = await PDF.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.sharePDF = async (req, res) => {
  try {
    const { pdfId, emails } = req.body;
    const pdf = await PDF.findById(pdfId);
    if (!pdf) return res.status(404).json({ message: "PDF not found" });

    if (pdf.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const uniqueLink = `${process.env.CLIENT_URL}/view/${pdfId}-${crypto
      .randomBytes(8)
      .toString("hex")}`;
    pdf.sharedWith.push(...emails);
    pdf.shareableLink = uniqueLink;
    await pdf.save();

    emails.forEach((email) => sendShareEmail(email, uniqueLink));   //Send email notification to each recipient

    res.json({
      message: "PDF shared successfully and email sent!",
      link: uniqueLink,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.getSharedPDF = async (req, res) => {
  try {
    const { link } = req.params;

    const cleanPdfId = link.split("-")[0];    // Extract only the first part before "-"

    const pdf = await PDF.findById(cleanPdfId);

    if (!pdf) {
      console.log("PDF Not Found in Database");
      return res.status(404).json({ message: "PDF not found" });
    }

    res.json({ pdf });
  } catch (error) {
    console.error("Error fetching shared PDF:", error);
    res.status(500).json({ message: "Server Error", error: error.toString() });
  }
};



