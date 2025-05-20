
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Briefcase, Check } from "lucide-react";
import { jobDescription } from '@/config/jobDescription';

const JobDescriptionCard: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <Briefcase className="mr-2 h-5 w-5" />
          Complete Job Description
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-skillsync-700">{jobDescription.title}</h2>
              <p className="text-gray-600 mt-1">{jobDescription.location}</p>
            </div>
            <div className="bg-skillsync-100 text-skillsync-700 px-4 py-2 rounded-md text-center">
              <span className="font-bold">{jobDescription.compensation}</span>
              <p className="text-sm">Compensation</p>
            </div>
          </div>
          
          <div className="bg-skillsync-50 p-4 rounded-md">
            <h3 className="font-semibold text-lg mb-3">Company Details</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-1/3">Employees</TableCell>
                  <TableCell>{jobDescription.companyDetails.employees}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Team Size</TableCell>
                  <TableCell>{jobDescription.companyDetails.teamSize}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Industry</TableCell>
                  <TableCell>{jobDescription.companyDetails.industry}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Reports To</TableCell>
                  <TableCell>{jobDescription.companyDetails.reportsTo}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Summary</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{jobDescription.summary}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3">Key Responsibilities</h3>
            <ul className="space-y-2">
              {jobDescription.responsibilities.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-skillsync-100 text-skillsync-700 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">{index + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-3">Requirements</h3>
            <ul className="space-y-2">
              {jobDescription.requirements.map((item, index) => (
                <li key={index} className="flex items-start">
                  <Check className="text-green-500 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-skillsync-50 p-4 rounded-md">
            <h3 className="font-semibold text-lg mb-2">Benefits</h3>
            <p className="text-gray-700">{jobDescription.benefits}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDescriptionCard;
