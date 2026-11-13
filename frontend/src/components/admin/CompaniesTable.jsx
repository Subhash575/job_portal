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
import { Edit2 } from 'lucide-react';
import { tileFor } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    store => store.company
  );
  const [filterCompany, setFilterCompany] = useState(companies);
  const navigate = useNavigate();
  useEffect(() => {
    const filteredCompany =
      companies.length >= 0 &&
      companies.filter(company => {
        if (!searchCompanyByText) {
          return true;
        }
        return company?.name
          ?.toLowerCase()
          .includes(searchCompanyByText.toLowerCase());
      });
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText]);
  return (
    <div className="rounded-2xl border border-line bg-white px-2">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Company</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!filterCompany?.length ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={3}
                className="py-10 text-center text-ink-muted"
              >
                No companies yet. Add one to start posting jobs.
              </TableCell>
            </TableRow>
          ) : (
            filterCompany.map(company => {
              const [tileBg, tileText] = tileFor(company.name);
              return (
                <TableRow key={company._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-line"
                        />
                      ) : (
                        <span
                          className="w-10 h-10 shrink-0 rounded-xl grid place-items-center font-extrabold"
                          style={{ background: tileBg, color: tileText }}
                        >
                          {company.name?.[0]?.toUpperCase() || '?'}
                        </span>
                      )}
                      <span className="font-bold">{company.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-ink-muted">
                    {company.createdAt?.split('T')[0]}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/admin/companies/${company._id}`)
                      }
                    >
                      <Edit2 /> Edit
                    </Button>
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

export default CompaniesTable;
