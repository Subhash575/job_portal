import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector(store => store.job);

  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();

  useEffect(() => {
    const filteredJobs = allAdminJobs.filter(job => {
      if (!searchJobByText) {
        return true;
      }
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name
          ?.toLowerCase()
          .includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);
  return (
    <div className="rounded-2xl border border-line bg-white px-2">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Posted</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!filterJobs?.length ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={4}
                className="py-10 text-center text-ink-muted"
              >
                No jobs posted yet.
              </TableCell>
            </TableRow>
          ) : (
            filterJobs.map(job => (
              <TableRow key={job._id}>
                <TableCell className="font-bold">{job?.title}</TableCell>
                <TableCell>{job?.company?.name}</TableCell>
                <TableCell className="font-mono text-xs text-ink-muted">
                  {job?.createdAt?.split('T')[0]}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/admin/jobs/${job._id}/applicants`)
                    }
                  >
                    <Users /> Applicants
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
