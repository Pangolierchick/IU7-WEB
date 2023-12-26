"use client";

import Advertisement from "@/components/advertisement/advertisement";
import { getAdvertisementsWithDescrFilter } from "@/services/advertisements";
import { Box } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function searchPage() {
  const [page, setPage] = useState(1);
  const [ads, setAds] = useState<any[]>([]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query");

  useEffect(() => {
    getAdvertisementsWithDescrFilter(searchQuery).then((v) => {
      setAds(v);
    });
  }, []);

  return (
    <Box
      sx={{
        marginTop: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        minWidth: "400px",
        maxWidth: "800px",
      }}
    >
      {ads.map((v, i) => (
        <Link
          style={{ textDecoration: "none", color: "#000000" }}
          href={`/advertisements/${v.id}`}
          key={i}
        >
          <Advertisement
            title={i.toString()}
            address={v.address}
            description={v.description}
            owner={v.user.login}
          />
        </Link>
      ))}
    </Box>
  );
}
