import { PRIVATE_PAGE } from "@/utils/site";

export const metadata = {
  title: "Forgot password",
  ...PRIVATE_PAGE,
};

export default function Layout({ children }) {
  return children;
}
