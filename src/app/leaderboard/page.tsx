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
        .order("duration", { ascending: false }) // Sort by duration in descending order

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
    return <p className="text-center text-lg font-medium">Loading...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-center text-3xl font-bold mb-8">Leaderboard</h1>
      <table className="w-full max-w-4xl mx-auto border-collapse border border-gray-300 text-center">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="border border-gray-300 px-4 py-2">Rank</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Duration</th>
            <th className="border border-gray-300 px-4 py-2">Published</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((player) => (
            <tr key={player.rank} className="even:bg-gray-700 odd:bg-gray-800">
              <td className="border border-gray-300 px-4 py-2">{player.rank}</td>
              <td className="border border-gray-300 px-4 py-2">{player.name}</td>
              <td className="border border-gray-300 px-4 py-2">{player.duration}</td>
              <td className="border border-gray-300 px-4 py-2">
                {formatDate(player.published)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
