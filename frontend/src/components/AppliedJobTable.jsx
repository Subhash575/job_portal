import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { useSelector } from 'react-redux';

// Status pill colors: lemon = waiting, mint = accepted, pink = rejected.
const STATUS = {
  pending: 'bg-[#fdeaa7] text-[#854d0e]',
  accepted: 'bg-[#c9f0dc] text-[#166534]',
  rejected: 'bg-[#fbd3e6] text-[#9d174d]',
};

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector(store => store.job);
  return (
    <div className="rounded-2xl border border-line bg-white px-2">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Date</TableHead>
            <TableHead>Job role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.length <= 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={4}
                className="py-10 text-center text-ink-muted"
              >
                You haven’t applied to any job yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map(appliedJob => (
              <TableRow key={appliedJob._id}>
                <TableCell className="font-mono text-xs text-ink-muted">
                  {appliedJob?.createdAt?.split('T')[0]}
                </TableCell>
                <TableCell className="font-bold">
                  {appliedJob.job?.title}
                </TableCell>
                <TableCell>{appliedJob.job?.company?.name}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg font-mono text-xs font-medium capitalize ${STATUS[appliedJob?.status] || STATUS.pending}`}
                  >
                    {appliedJob.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
