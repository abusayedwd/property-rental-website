import { PRIVATE_PAGE } from "@/utils/site";

export const metadata = {
  title: "Verify your email",
  ...PRIVATE_PAGE,
};

export default function Layout({ children }) {
  return children;
}
