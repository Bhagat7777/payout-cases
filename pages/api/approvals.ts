import { NextApiRequest, NextApiResponse } from "next";

// Mock data - replace with database query
const mockApprovals = [
  {
    id: "1",
    traderName: "Alex Johnson",
    propFirm: "FTMO",
    amount: 2500,
    date: "2023-06-15",
    status: "completed"
  },
  {
    id: "2",
    traderName: "Maria Garcia",
    propFirm: "MyForexFunds",
    amount: 1800,
    date: "2023-06-14",
    status: "completed"
  },
  {
    id: "3",
    traderName: "James Wilson",
    propFirm: "FundedNext",
    amount: 3200,
    date: "2023-06-14",
    status: "pending"
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Simulate network delay
  setTimeout(() => {
    res.status(200).json(mockApprovals);
  }, 500);
}