import { PRIVATE_PAGE } from "@/utils/site";

export const metadata = {
  title: "Add a property",
  ...PRIVATE_PAGE,
};

export default function Layout({ children }) {
  return children;
}
