// Access rules from the audit: who may change what. Runs against an in-memory MongoDB, never the .env database.
import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

let mongod, server, base;

before(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  await Application.init(); // build the unique (job, applicant) index before the apply-twice test
  process.env.SECRET_KEY ||= "test-secret";
  server = app.listen(0);
  base = `http://127.0.0.1:${server.address().port}/api/v1`;
});

after(async () => {
  server?.close();
  await mongoose.disconnect();
  await mongod?.stop();
});

const id = () => new mongoose.Types.ObjectId();
const as = (userId, role) => ({
  Cookie: `token=${jwt.sign({ userId, role }, process.env.SECRET_KEY)}`,
});
const call = (method, path, headers, body) =>
  fetch(base + path, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: body && JSON.stringify(body),
  });

const makeJob = async (recruiterId) => {
  const company = await Company.create({ name: `Co ${id()}`, userId: recruiterId });
  return Job.create({
    title: "Dev",
    description: "Build things",
    salary: 10,
    experienceLevel: 1,
    location: "Pune",
    jobType: "Full-time",
    position: 2,
    company: company._id,
    created_by: recruiterId,
  });
};

test("a student can't change an application's status; the job's recruiter can", async () => {
  const recruiter = id();
  const student = id();
  const job = await makeJob(recruiter);
  const application = await Application.create({ job: job._id, applicant: student });
  const path = `/application/status/${application._id}/update`;

  const denied = await call("POST", path, as(student, "student"), { status: "accepted" });
  assert.equal(denied.status, 404);
  assert.equal((await Application.findById(application._id)).status, "pending");

  const allowed = await call("POST", path, as(recruiter, "recruiter"), { status: "accepted" });
  assert.equal(allowed.status, 200);
  assert.equal((await Application.findById(application._id)).status, "accepted");
});

test("a recruiter can't edit another recruiter's company; the owner can", async () => {
  const owner = id();
  const company = await Company.create({ name: "Original", userId: owner });
  const path = `/company/update/${company._id}`;

  const denied = await call("PUT", path, as(id(), "recruiter"), { name: "Hacked" });
  assert.equal(denied.status, 404);
  assert.equal((await Company.findById(company._id)).name, "Original");

  const allowed = await call("PUT", path, as(owner, "recruiter"), { name: "Renamed" });
  assert.equal(allowed.status, 200);
  assert.equal((await Company.findById(company._id)).name, "Renamed");
});

test("applying to the same job twice is refused", async () => {
  const student = id();
  const job = await makeJob(id());
  const path = `/application/apply/${job._id}`;

  assert.equal((await call("GET", path, as(student, "student"))).status, 201);
  assert.equal((await call("GET", path, as(student, "student"))).status, 400);
  assert.equal(await Application.countDocuments({ job: job._id, applicant: student }), 1);
});
