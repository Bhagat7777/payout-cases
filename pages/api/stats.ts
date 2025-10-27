import { NextApiRequest, NextApiResponse } from "next";

// Mock data - replace with database query
const mockStats = {
  kpi: {
    totalPayouts: 1245678,
    approvalRate: 78.5,
    averagePayout: 2450,
  },
  lineData: [
    { date: "2023-05-01", approvals: 12, denials: 5 },
    { date: "2023-05-08", approvals: 19, denials: 8 },
    { date: "2023-05-15", approvals: 15, denials: 6 },
    { date: "2023-05-22", approvals: 22, denials: 4 },
    { date: "2023-05-29", approvals: 18, denials: 7 },
    { date: "2023-06-05", approvals: 25, denials: 3 },
    { date: "2023-06-12", approvals: 30, denials: 5 },
  ],
  pieData: [
    { name: "FTMO", value: 35 },
    { name: "MyForexFunds", value: 25 },
    { name: "FundedNext", value: 20 },
    { name: "The5ers", value: 15 },
    { name: "Others", value: 5 },
  ]
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Simulate network delay
  setTimeout(() => {
    res.status(200).json(mockStats);
  }, 500);
}