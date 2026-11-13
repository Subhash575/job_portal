import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
  const userId = req.id;
  const jobId = req.params.id;
  if (!jobId) {
    return res.status(400).json({
      message: "Job id is required.",
      success: false,
    });
  }
  // check if the jobs exists
  if (!(await Job.exists({ _id: jobId }))) {
    return res.status(404).json({
      message: "Job not found",
      success: false,
    });
  }
  // create a new application. The unique index on (job, applicant) refuses a second one,
  // even when two requests arrive at the same moment.
  let newApplication;
  try {
    newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already applied for this jobs",
        success: false,
      });
    }
    throw error;
  }

  // $push changes only this list, so two applicants can't overwrite each other's entry
  await Job.updateOne(
    { _id: jobId },
    { $push: { applications: newApplication._id } },
  );
  return res.status(201).json({
    message: "Job applied successfully.",
    success: true,
  });
};
//login user see all the apply job show.
export const getAppliedJobs = async (req, res) => {
  const userId = req.id;
  const application = await Application.find({ applicant: userId })
    .sort({ createdAt: -1 })
    .populate({ path: "job", populate: { path: "company" } });
  return res.status(200).json({
    application,
    success: true,
  });
};
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req, res) => {
  const jobId = req.params.id;
  // Only the recruiter who posted the job may see its applicants.
  const job = await Job.findOne({ _id: jobId, created_by: req.id }).populate({
    path: "applications",
    options: { sort: { createdAt: -1 } },
    populate: {
      path: "applicant", //Here we done the nested populate.
      select: "-password", // never send password hashes
    },
  });
  if (!job) {
    return res.status(404).json({
      message: "Job not found.",
      success: false,
    });
  }
  return res.status(200).json({
    job,
    success: true,
  });
};
//Person is selected or Rejected or pending therefore updateStatus is use.
export const updateStatus = async (req, res) => {
  const { status } = req.body;
  const applicationId = req.params.id;
  if (!status) {
    return res.status(400).json({
      message: "status is required",
      success: false,
    });
  }
  if (!["pending", "accepted", "rejected"].includes(String(status).toLowerCase())) {
    return res.status(400).json({
      message: "status must be pending, accepted or rejected",
      success: false,
    });
  }

  // find the application by applicantion id
  const application = await Application.findOne({ _id: applicationId });
  if (!application) {
    return res.status(404).json({
      message: "Application not found.",
      success: false,
    });
  }

  // Only the recruiter who posted the job may change an application's status.
  if (!(await Job.exists({ _id: application.job, created_by: req.id }))) {
    return res.status(404).json({
      message: "Application not found.",
      success: false,
    });
  }

  // update the status
  application.status = String(status).toLowerCase();
  await application.save();

  return res.status(200).json({
    message: "Status updated successfully.",
    success: true,
  });
};
