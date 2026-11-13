import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { FileText } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ['Accepted', 'Rejected'];

// Same pill colors as the job seeker's Profile table.
const STATUS = {
  pending: 'bg-[#fdeaa7] text-[#854d0e]',
  accepted: 'bg-[#c9f0dc] text-[#166534]',
  rejected: 'bg-[#fbd3e6] text-[#9d174d]',
};

const ApplicantsTable = () => {
  const { applicants } = useSelector(store => store.application);
  // Decisions made on this page, so the status pill updates without a refetch.
  const [statuses, setStatuses] = useState({});

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      );
      if (res.data.success) {
        setStatuses(prev => ({ ...prev, [id]: status.toLowerCase() }));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Could not update. Please try again.'
      );
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-white px-2">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Decision</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!applicants?.applications?.length ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={6}
                className="py-10 text-center text-ink-muted"
              >
                No one has applied yet.
              </TableCell>
            </TableRow>
          ) : (
            applicants.applications.map(item => {
              const status = statuses[item._id] || item.status || 'pending';
              return (
                <TableRow key={item._id}>
                  <TableCell className="font-bold">
                    {item?.applicant?.fullname}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col font-mono text-xs">
                      <span>{item?.applicant?.email}</span>
                      <span className="text-ink-muted">
                        {item?.applicant?.phoneNumber}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.applicant?.profile?.resume ? (
                      <a
                        className="inline-flex items-center gap-1.5 font-bold text-brand hover:underline"
                        href={item.applicant.profile.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText aria-hidden="true" className="w-4 h-4" />
                        {item.applicant.profile.resumeOriginalName || 'Resume'}
                      </a>
                    ) : (
                      <span className="text-ink-muted">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-ink-muted">
                    {
                      (item?.createdAt || item?.applicant?.createdAt)?.split(
                        'T'
                      )[0]
                    }
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg font-mono text-xs font-medium capitalize ${STATUS[status] || STATUS.pending}`}
                    >
                      {status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      {shortlistingStatus.map(s => (
                        <Button
                          key={s}
                          size="sm"
                          variant={s === 'Accepted' ? 'default' : 'outline'}
                          disabled={status === s.toLowerCase()}
                          onClick={() => statusHandler(s, item?._id)}
                        >
                          {s === 'Accepted' ? 'Accept' : 'Reject'}
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
