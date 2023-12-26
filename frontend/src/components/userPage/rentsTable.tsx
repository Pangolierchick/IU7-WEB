"use client";

import {
  Box,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
} from "@mui/material";

export default function RentsTable({
  rents,
}: {
  rents: {
    title: string;
    adId: string;
    dateFrom: string;
    dateUntil: string;
    userId: string;
  }[];
}) {
  return (
    <Box
      sx={{
        borderRadius: "12px",
        boxShadow: "-1px 1px 10px 0px rgba(0, 0, 0, 0.15)",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
      }}
    >
      <p style={{ fontSize: "22px", fontWeight: 600 }}>Аренды</p>

      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table
          sx={{
            [`& .${tableCellClasses.root}`]: {
              borderBottom: "none",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Дата въезда</TableCell>
              <TableCell>Дата выезда</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rents.map((rent, i) => (
              <TableRow
                key={rent.title ?? i + 1}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Link
                    style={{ textDecoration: "none", color: "#000000" }}
                    href={`/advertisements/${rent.adId}`}
                  >
                    {rent.title ?? i + 1}
                  </Link>
                </TableCell>
                <TableCell>
                  {new Date(rent.dateFrom).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(rent.dateUntil).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
