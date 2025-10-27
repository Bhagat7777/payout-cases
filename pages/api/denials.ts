import { NextApiRequest, NextApiResponse } from "next";

// Mock data - replace with database query
const mockDenials = [
  {
    id: "1",
    traderName: "Sam Thompson",
    propFirm: "FTMO",
    reason: "Rule violation",
    date: "2023-06-12",
    amount: 2500,
    status: "resolved"
  },
  {
    id: "2",
    traderName: "Emma Rodriguez",
    propFirm: "MyForexFunds",
    reason: "Platform issue",
    date: "2023-06-10",
    amount: 1800,
    status: "pending"
  },
  {
    id: "3",
    traderName: "Michael Chen",
    propFirm: "FundedNext",
    reason: "Documentation missing",
    date: "2023-06-08",
    amount: 3200,
    status: "disputed"
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Simulate network delay
  setTimeout(() => {
    res.status(200).json(mockDenials);
  }, 500);
}