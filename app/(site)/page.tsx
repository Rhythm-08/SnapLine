import FeedView from "@/components/feed/FeedView";
import SearchInput from "@/components/core/SearchInput";

export default function Home() {
  return (
    <div>
      <SearchInput />
      <FeedView />
    </div>
  );
}
