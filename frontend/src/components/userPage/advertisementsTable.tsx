"use client";

import { shortenString } from "@/utils";
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

export default function AdvertisementTable({
  advertisements,
}: {
  advertisements: {
    title: string;
    description: string;
    cost: number;
    address: string;
    id: string;
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
      <p style={{ fontSize: "22px", fontWeight: 600 }}>Объявления</p>

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
              <TableCell>Описание</TableCell>
              <TableCell>Стоимость</TableCell>
              <TableCell>Адрес</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {advertisements.map((advertisement, i) => (
              <TableRow
                key={advertisement.title ?? i + 1}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Link
                    style={{ textDecoration: "none", color: "#000000" }}
                    href={`/advertisements/${advertisement.id}`}
                  >
                    {advertisement.title ?? i + 1}
                  </Link>
                </TableCell>
                <TableCell>
                  {shortenString(advertisement.description)}
                </TableCell>
                <TableCell>{advertisement.cost}</TableCell>
                <TableCell>{advertisement.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
