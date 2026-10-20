import { PRIVATE_PAGE } from "@/utils/site";

export const metadata = {
  title: "Edit profile",
  ...PRIVATE_PAGE,
};

export default function Layout({ children }) {
  return children;
}
