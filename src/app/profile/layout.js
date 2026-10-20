import { PRIVATE_PAGE } from "@/utils/site";

export const metadata = {
  title: "My profile",
  ...PRIVATE_PAGE,
};

export default function Layout({ children }) {
  return children;
}
