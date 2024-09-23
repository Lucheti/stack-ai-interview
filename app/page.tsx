"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RecoilRoot } from 'recoil';
import { queryClient } from './api/queryClient';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { QueryClientProvider } from "@tanstack/react-query";
import { ConnectionList } from "./components/connection/connectionList";
import { FileTree } from "./components/fileTree/fileTree";
import { CreateKnowledgeBaseButton } from "./components/knowledgeBase/createKnowledgeBaseButton";
import { FadeText } from "@/components/magicui/fade-text";
import { KnowledgeBaseList } from "./components/knowledgeBase/knowledgeBaseList";
import { AuthorizationService } from './api/services/authorizationService';

const HomeContent = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = AuthorizationService.getInstance().isLoggedIn();
      if (!isLoggedIn) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <Card>
      <CardHeader>
        <FadeText
          className="font-semibold leading-none tracking-tight"
          direction="up"
          framerProps={{
            show: { transition: { delay: 0.2 } },
          }}
          text="Create Knowledge Base"
        />

        <FadeText
          className="text-sm text-muted-foreground"
          direction="up"
          framerProps={{
            show: { transition: { delay: 0.2 } },
          }}
          text="Select an integration and the files you want to include in the knowledge base."
        />
      </CardHeader>
      <CardContent className="w-full">
        <div className='flex h-full gap-4 w-[1200px]'>
          <div className="flex-1 flex-col h-full gap-4">
            <ConnectionList />
            <FileTree />
          </div>

          <div className="w-1/3 border-l border-gray-200">
            <KnowledgeBaseList />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4 justify-end">
        <CreateKnowledgeBaseButton />
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <HomeContent />
      </QueryClientProvider>
    </RecoilRoot>
  );
}
