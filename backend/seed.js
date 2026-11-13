// Demo data: `npm run seed` (local MongoDB) or `npm run seed -- --remote` (any other host, e.g. Atlas).
// Rerunnable: it deletes only earlier seed data (users @seed.test and what they own), never anything else.
import { pathToFileURL } from "node:url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./models/user.model.js";
import { Company } from "./models/company.model.js";
import { Job } from "./models/job.model.js";
import { Application } from "./models/application.model.js";

export const SEED_PASSWORD = "demo1234";
const SEED_EMAIL = /@seed\.test$/;

const recruiters = [
  ["Ananya Rao", "ananya@seed.test"],
  ["Vikram Mehta", "vikram@seed.test"],
  ["Priya Nair", "priya@seed.test"],
];
const students = [
  ["Rahul Sharma", "rahul@seed.test", "Final-year CS student who likes building UIs.", ["React", "JavaScript", "CSS"]],
  ["Sneha Iyer", "sneha@seed.test", "Commerce graduate moving into fintech.", ["Excel", "SQL", "Python"]],
  ["Arjun Patel", "arjun@seed.test", "Backend developer with two years of Node.js.", ["Node.js", "MongoDB", "Express"]],
  ["Kavya Reddy", "kavya@seed.test", "Looking for my first internship.", ["HTML", "CSS", "Git"]],
];
// [name, owner recruiter index, location, description]
const companies = [
  ["Seatwise Labs (demo)", 0, "Bangalore", "Product studio building hiring tools."],
  ["Ledgerline Finance (demo)", 1, "Mumbai", "Payments and lending for small businesses."],
  ["Signalpath Telecom (demo)", 2, "Hyderabad", "Mobile network software."],
  ["Northbeam Consulting (demo)", 0, "Gurugram", "Technology and strategy consulting."],
];
// Titles, descriptions and locations use the exact words of the Home categories and Jobs filters, which match by text.
// [title, company index, location, salary LPA, experience yrs, jobType, positions, requirements, description]
const jobs = [
  ["Frontend Developer", 0, "Bangalore", 12, 1, "Full-time", 3, ["React", "Tailwind", "JavaScript"], "Build the screens candidates use every day."],
  ["Backend Developer", 0, "Pune", 18, 2, "Full-time", 2, ["Node.js", "Express", "MongoDB"], "Design and run the APIs behind our job board."],
  ["FullStack Developer", 0, "Delhi NCR", 24, 3, "Full-time", 2, ["React", "Node.js", "MongoDB"], "Own features end to end, from database to UI."],
  ["Frontend Developer Intern", 0, "Noida", 4, 0, "Internship", 5, ["HTML", "CSS", "JavaScript"], "Six-month internship with a mentor on the design system."],
  ["Risk Analyst", 1, "Mumbai", 15, 2, "Full-time", 1, ["Excel", "SQL", "Statistics"], "Finance & Banking: score small-business loans."],
  ["Backend Developer (Payments)", 1, "Chennai", 30, 4, "Full-time", 2, ["Java", "PostgreSQL", "Kafka"], "Finance & Banking: keep UPI payments fast and correct."],
  ["Network Engineer", 2, "Hyderabad", 10, 1, "Full-time", 4, ["Networking", "Linux", "Python"], "Telecommunications: run and monitor our 5G core."],
  ["Senior FullStack Developer", 2, "Kolkata", 45, 6, "Remote", 1, ["TypeScript", "React", "Go"], "Telecommunications: lead the network dashboard team."],
  ["Strategy Consultant", 3, "Gurugram", 28, 3, "Full-time", 2, ["Research", "Presentations", "Excel"], "Consulting: help clients plan digital projects."],
  ["Engineering Manager", 3, "Bangalore", 110, 10, "Full-time", 1, ["Leadership", "System design", "Hiring"], "Consulting: lead a team of twelve engineers for a bank."],
];
// [student index, job index, status]
const applications = [
  [0, 0, "pending"], [0, 2, "accepted"],
  [1, 0, "rejected"], [1, 4, "pending"],
  [2, 1, "pending"], [2, 6, "accepted"],
  [3, 3, "pending"], [3, 8, "pending"],
];

export const seed = async () => {
  // Remove earlier seed data, including applications real users made to demo jobs.
  const oldUsers = (await User.find({ email: SEED_EMAIL }, "_id")).map(u => u._id);
  const oldJobs = (await Job.find({ created_by: { $in: oldUsers } }, "_id")).map(j => j._id);
  const oldApps = await Application.distinct("_id", { $or: [{ job: { $in: oldJobs } }, { applicant: { $in: oldUsers } }] });
  await Application.deleteMany({ _id: { $in: oldApps } });
  // Seed students may have applied to real jobs; take those ids off the real jobs too.
  await Job.updateMany({ applications: { $in: oldApps } }, { $pull: { applications: { $in: oldApps } } });
  await Job.deleteMany({ _id: { $in: oldJobs } });
  await Company.deleteMany({ userId: { $in: oldUsers } });
  await User.deleteMany({ _id: { $in: oldUsers } });

  const password = await bcrypt.hash(SEED_PASSWORD, 10); // same cost as register, so /login works
  const phone = i => `98765${String(i).padStart(5, "0")}`;
  const rec = await User.insertMany(
    recruiters.map(([fullname, email], i) => ({ fullname, email, password, role: "recruiter", phoneNumber: phone(i) })),
  );
  const stu = await User.insertMany(
    students.map(([fullname, email, bio, skills], i) => ({
      fullname, email, password, role: "student", phoneNumber: phone(10 + i), profile: { bio, skills },
    })),
  );
  const cos = await Company.insertMany(
    companies.map(([name, owner, location, description]) => ({ name, location, description, userId: rec[owner]._id })),
  );
  const js = await Job.insertMany(
    jobs.map(([title, c, location, salary, experienceLevel, jobType, position, requirements, description]) => ({
      title, location, salary, experienceLevel, jobType, position, requirements, description,
      company: cos[c]._id, created_by: cos[c].userId,
    })),
  );
  const apps = await Application.insertMany(
    applications.map(([s, j, status]) => ({ applicant: stu[s]._id, job: js[j]._id, status })),
  );
  // The job page counts job.applications and the applicants list populates through it.
  await Job.bulkWrite(apps.map(a => ({ updateOne: { filter: { _id: a.job }, update: { $push: { applications: a._id } } } })));

  return { users: rec.length + stu.length, companies: cos.length, jobs: js.length, applications: apps.length };
};

// Hosts in the URI, without credentials, e.g. ["cluster0.abc.mongodb.net"].
export const hostsOf = uri => uri.replace(/^[^:]+:\/\//, "").replace(/^[^@/]*@/, "").split(/[/?]/)[0].split(",");
const isLocal = uri =>
  hostsOf(uri).every(h => ["localhost", "127.0.0.1", "[::1]"].includes(h.replace(/:\d+$/, "")));

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  (await import("dotenv")).config();
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not set.");
  if (!isLocal(uri) && !process.argv.includes("--remote")) {
    console.error(`Refusing to seed ${hostsOf(uri).join(",")}: it is not a local database.`);
    console.error("Demo jobs there are visible to everyone using it. If you mean it: npm run seed -- --remote");
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log(`Seeding database "${mongoose.connection.name}" on ${hostsOf(uri).join(",")}`);
  console.log(await seed());
  console.log(`Log in with any @seed.test email and password ${SEED_PASSWORD}:`);
  console.log(`  recruiter: ${recruiters[0][1]}   student: ${students[0][1]}`);
  await mongoose.disconnect();
}
