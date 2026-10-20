import { PRIVATE_PAGE } from "@/utils/site";

export const metadata = {
  title: "Messages",
  ...PRIVATE_PAGE,
};

export default function Layout({ children }) {
  return children;
}
