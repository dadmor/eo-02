import { useTable, useNavigation, useDelete } from "@refinedev/core";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Eye, Edit, Trash2, Plus, ExternalLink } from "lucide-react";
import { FlexBox, GridBox } from "@/components/shared";
import { PaginationSwith } from "@/components/navigation";
import { Lead } from "@/components/reader";
import { useLoading } from "@/utility";
import { Badge, Button, Input } from "@/components/ui";


export const WebsiteAnalysisList = () => {
  const {
    tableQuery: { data, isLoading, isError },
    current,
    setCurrent,
    pageSize,
    setFilters,
  } = useTable();
  const { create, edit, show } = useNavigation();
  const { mutate: deleteAnalysis } = useDelete();

  const init = useLoading({ isLoading, isError });
  if (init) return init;

  return (
    <>
      <FlexBox>
        <Lead
          title={`Website Analyses`}
          description={`Manage your website analyses`}
        ></Lead>
        <Button onClick={() => create("website_analyses")}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Analysis
        </Button>
      </FlexBox>

      <FlexBox>
        <Input
          placeholder="Search analyses..."
          className="max-w-sm"
          onChange={(e) => {
            setFilters([
              {
                field: "url",
                operator: "contains",
                value: e.target.value,
              },
            ]);
          }}
        />
      </FlexBox>

      <GridBox>
        {data?.data?.map((analysis: any) => (
          <Card key={analysis.id}>
            <CardHeader>
              <FlexBox>
                <Badge variant="secondary" className="mb-2">
                  {analysis.industry}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  #{analysis.id.slice(0, 8)}
                </span>
              </FlexBox>

              <Lead
                title={
                  <>
                    <span className="truncate text-blue-800">
                      {analysis.url}
                    </span>
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  </>
                }
                description={`${analysis.description?.substring(0, 100)}...`}
                variant="card"
              />
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-1">
                {analysis.keywords
                  ?.slice(0, 3)
                  .map((keyword: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                {analysis.keywords?.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{analysis.keywords.length - 3} more
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <span>
                  {new Date(analysis.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>

            <CardFooter>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => show("website_analyses", analysis.id)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => edit("website_analyses", analysis.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (
                    confirm("Are you sure you want to delete this analysis?")
                  ) {
                    deleteAnalysis({
                      resource: "website_analyses",
                      id: analysis.id,
                    });
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </GridBox>

      {/* Użycie nowego komponentu Pagination */}
      <PaginationSwith
        current={current}
        pageSize={pageSize}
        total={data?.total || 0}
        setCurrent={setCurrent}
        itemName="analyses"
      />
    </>
  );
};
