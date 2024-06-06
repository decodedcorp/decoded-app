import React from "react";

interface PageProps {
  params: {
    artistId: string;
  };
}

function page({ params }: PageProps) {
  return <div>THIS IS ARTIST {params.artistId} PAGE </div>;
}

export default page;
