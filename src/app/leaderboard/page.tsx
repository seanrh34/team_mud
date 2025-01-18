"use client"; // Mark this as a client component

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("name, duration, published")
        .order("duration", { ascending: false }); // Sort by duration in descending order

      if (error) {
        console.error("Error fetching leaderboard:", error.message);
      } else {
        // Add rank based on sorted data
        const rankedData = data.map((player, index) => ({
          ...player,
          rank: index + 1,
        }));
        setLeaderboardData(rankedData);
      }

      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  // Format the published date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Leaderboard</h1>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          margin: "0 auto",
          maxWidth: "600px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f8f9fa" }}>
            <th style={{ border: "1px solid #ccc", padding: "0.75rem" }}>Rank</th>
            <th style={{ border: "1px solid #ccc", padding: "0.75rem" }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: "0.75rem" }}>Duration</th>
            <th style={{ border: "1px solid #ccc", padding: "0.75rem" }}>Published</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((player) => (
            <tr key={player.rank}>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "0.75rem",
                  textAlign: "center",
                }}
              >
                {player.rank}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "0.75rem" }}>
                {player.name}
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "0.75rem",
                  textAlign: "center",
                }}
              >
                {player.duration}
              </td>
              <td
                style={{
                  border: "1px solid #ccc",
                  padding: "0.75rem",
                  textAlign: "center",
                }}
              >
                {formatDate(player.published)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
