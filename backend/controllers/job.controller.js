import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";

// admin post krega job
export const postJob = async (req, res) => {
  const {
    title,
    description,
    requirements,
    salary,
    location,
    jobType,
    experience,
    position,
    companyId,
  } = req.body;
  //User which create the job that id
  const userId = req.id;

  if (
    !title ||
    !description ||
    !requirements ||
    !salary ||
    !location ||
    !jobType ||
    !experience ||
    !position ||
    !companyId
  ) {
    return res.status(400).json({
      message: "Somethin is missing.",
      success: false,
    });
  }
  // The company must belong to the recruiter who is posting.
  if (!(await Company.exists({ _id: companyId, userId }))) {
    return res.status(404).json({
      message: "Company not found.",
      success: false,
    });
  }
  const job = await Job.create({
    title,
    description,
    requirements: requirements.split(","),
    salary: Number(salary),
    location,
    jobType,
    experienceLevel: experience,
    position,
    company: companyId,
    created_by: userId,
  });
  return res.status(201).json({
    message: "New job created successfully.",
    job,
    success: true,
  });
};
// student k liye: Get All jobs
export const getAllJobs = async (req, res) => {
  // in url we pass the keyword as:
  // http://localhost/company/?keyword="frontend developer"
  // The keyword is plain text, not a pattern: escape it so a crafted search can't make MongoDB work for ages.
  const keyword = String(req.query.keyword || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const query = {
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  };
  const jobs = await Job.find(query)
    .populate({
      path: "company",
    })
    .sort({ createdAt: -1 })
    .limit(100); // shortcut: the frontend has no paging yet, so older jobs drop off; add paging when there are more than 100 jobs
  if (!jobs) {
    return res.status(404).json({
      message: "Jobs not found.",
      success: false,
    });
  }
  return res.status(200).json({
    jobs,
    success: true,
  });
};
// student:-  Here we get jobById
export const getJobById = async (req, res) => {
  const jobId = req.params.id;
  // Public route: only who applied (for the count and "already applied"), never statuses.
  const job = await Job.findById(jobId).populate({
    path: "applications",
    select: "applicant",
  });

  if (!job) {
    return res.status(404).json({
      message: "Jobs not found.",
      success: false,
    });
  }
  return res.status(200).json({ job, success: true });
};
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
  const adminId = req.id;
  const jobs = await Job.find({ created_by: adminId }).populate({
    path: "company",
    createdAt: -1,
  });
  if (!jobs) {
    return res.status(404).json({
      message: "Jobs not found.",
      success: false,
    });
  }
  return res.status(200).json({
    jobs,
    success: true,
  });
};
