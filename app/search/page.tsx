"use client";

import CombinedListComponent from "@/components/feed/CombinedListComponent";
import FeedCard from "@/components/feed/FeedCard";
import RUserCard from "@/components/search/RUserCard";
import SearchData from "@/components/search/SearchData";
import SearchInput from "@/components/core/SearchInput";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useCurrentUser from "@/hooks/useCurrentUser";
import { SearchResults } from "@/utils/search-results";
import { useSearchParams } from "next/navigation";
import React from "react";
import useSWR from "swr";
import UsersLoading from "@/components/loading/UserLoading";
import FeedLoading from "@/components/loading/FeedLoading";

const fetchPosts = async (url: string) => {
  const response = await fetch(url);

  if (response.status == 400) {
    throw new Error("No Query Provided");
  }
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
};
const SearchPage = () => {
  const { data: currentUser, isLoading: isUser } = useCurrentUser();

  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;

  const encodedSearchQuery = encodeURI(searchQuery || "");

  const {
    data,
    isLoading,
    error,
  }: {
    data: SearchResults;
    isLoading: boolean;
    error: any;
  } = useSWR(`/api/search?q=${encodedSearchQuery}`, fetchPosts, {
    revalidateOnFocus: false,
  });

  if (searchQuery == null || searchQuery === "" || searchQuery === undefined) {
    return (
      <div className="flex items-center flex-col w-full">
        <SearchInput onPage />
        {isUser ? <UsersLoading /> : <SearchData currentUser={currentUser} />}
      </div>
    );
  }

  if (error) {
    console.log(error);
    return <p>error: {error}</p>;
  }

  if (!encodedSearchQuery) {
    <div>In Page Data</div>;
  }

  return (
    <div>
      <SearchInput onPage />
      <span className="text-xl dark:text-white p-4">
        Showing results for:{" "}
        <span className="font-semibold dark:text-white ">{searchQuery}</span>
      </span>

      <Tabs defaultValue="top" className="w-full p-4">
        <TabsList>
          <TabsTrigger value="top">Top</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="users">Accounts</TabsTrigger>
        </TabsList>
        <Separator orientation="horizontal" className="w-full mt-4" />
        <div>
          <TabsContent value="top">
            {isLoading || isUser ? (
              <FeedLoading />
            ) : (
              <CombinedListComponent data={data} currentUser={currentUser} />
            )}
          </TabsContent>
          <TabsContent value="prompts">
            {isLoading ? (
              <div>
                <p>prompts loading</p>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 sm:p-4">
                {data?.prompts.flatMap((prompt) => (
                  <FeedCard currentUser={currentUser} prompt={prompt} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="users">
            {isUser ? (
              <div>loading</div>
            ) : (
              <div className="flex flex-col space-y-3 sm:p-4">
                {data?.users.flatMap((user) => (
                  <RUserCard user={user} currentUser={currentUser} />
                ))}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
      {/* )} */}
    </div>
  );
};

export default SearchPage;
