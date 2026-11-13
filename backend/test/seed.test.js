// The seed can be rerun, keeps job.applications in sync, and never touches non-seed data.
import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import { seed, hostsOf, SEED_PASSWORD } from "../seed.js";
import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

let mongod, server;

before(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  await Application.init();
  process.env.SECRET_KEY ||= "test-secret";
  server = app.listen(0);
});

after(async () => {
  server?.close();
  await mongoose.disconnect();
  await mongod?.stop();
});

test("seeding twice gives the same data and leaves real data alone", async () => {
  const real = await User.create({ fullname: "Real", email: "real@gmail.com", phoneNumber: "1", password: "x", role: "recruiter" });
  const realCo = await Company.create({ name: "Real Co", userId: real._id });
  const realJob = await Job.create({
    title: "Real job", description: "d", salary: 1, experienceLevel: 0, location: "Pune",
    jobType: "Full-time", position: 1, company: realCo._id, created_by: real._id,
  });

  const first = await seed();
  const second = await seed();
  assert.deepEqual(second, first);
  assert.equal(await User.countDocuments(), first.users + 1);
  assert.equal(await Job.countDocuments(), first.jobs + 1);
  assert.equal(await Application.countDocuments(), first.applications);
  assert.ok(await Job.exists({ _id: realJob._id }));
  assert.ok(await Company.exists({ _id: realCo._id }));

  for (const job of await Job.find({ created_by: { $ne: real._id } })) {
    assert.equal(job.applications.length, await Application.countDocuments({ job: job._id }), job.title);
  }
});

test("a seed account logs in through the real route", async () => {
  await seed();
  const res = await fetch(`http://127.0.0.1:${server.address().port}/api/v1/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "ananya@seed.test", password: SEED_PASSWORD, role: "recruiter" }),
  });
  assert.equal(res.status, 200);
});

test("hostsOf never returns credentials", () => {
  assert.deepEqual(hostsOf("mongodb+srv://user:p%40ss@cluster0.abc.mongodb.net/db?x=1"), ["cluster0.abc.mongodb.net"]);
  assert.deepEqual(hostsOf("mongodb://localhost:27017,127.0.0.1:27018/db"), ["localhost:27017", "127.0.0.1:27018"]);
});
