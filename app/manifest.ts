import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JustServicesPro — Business & Corporate Solutions Nigeria",
    short_name: "JustServicesPro",
    description:
      "Nigeria's trusted partner for CAC registration, websites, cloud services, business consulting, grants, and courses.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B1E3D",
    theme_color: "#0B1E3D",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
