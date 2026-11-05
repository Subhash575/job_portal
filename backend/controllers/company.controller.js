import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

//Register for company.
export const registerCompany = async (req, res) => {
  const { companyName } = req.body;
  if (!companyName) {
    return res.status(400).json({
      message: "Company name is required.",
      success: false,
    });
  }
  //find company by name
  let company = await Company.findOne({ name: companyName });
  if (company) {
    return res.status(400).json({
      message: "You can't register same company.",
      success: false,
    });
  }
  company = await Company.create({
    name: companyName,
    userId: req.id,
  });

  return res.status(201).json({
    message: "Company registered successfully.",
    company,
    success: true,
  });
};

export const getCompany = async (req, res) => {
  //user which register/create the company that Id we needed
  const userId = req.id; // logged in user id
  //It will return the array/list of company create by the user.
  const companies = await Company.find({ userId });
  if (!companies) {
    return res.status(404).json({
      message: "Companies not found.",
      success: false,
    });
  }
  return res.status(200).json({
    companies,
    success: true,
  });
};

// get company by id
export const getCompanyById = async (req, res) => {
  //In route there is params which is for ex: company/:id
  const companyId = req.params.id;
  const company = await Company.findById(companyId);
  if (!company) {
    return res.status(404).json({
      message: "Company not found.",
      success: false,
    });
  }
  return res.status(200).json({
    company,
    success: true,
  });
};

//UpdateCompany Information
export const updateCompany = async (req, res) => {
  //updating data get from the req body.
  const { name, description, website, location } = req.body;

  // Only the company's owner may edit it. Checked before the upload so strangers can't fill our Cloudinary storage.
  if (!(await Company.exists({ _id: req.params.id, userId: req.id }))) {
    return res.status(404).json({
      message: "Company not found.",
      success: false,
    });
  }

  const file = req.file;
  // idhar cloudinary ayega

  const fileUri = getDataUri(file);
  const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
  const logo = cloudResponse.secure_url;

  const updateData = { name, description, website, location, logo };
 

  //Here we find the company by id and then updateData
  const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });

  if (!company) {
    return res.status(404).json({
      message: "Company not found.",
      success: false,
    });
  }
  return res.status(200).json({
    message: "Company information updated.",
    success: true,
  });
};
