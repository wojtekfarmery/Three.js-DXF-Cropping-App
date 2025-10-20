import { Card, CardContent } from "../../components/ui/card";

export const Home = () => {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex items-center justify-center bg-muted/20 border-r border-border">
          <Card className="p-10 text-center opacity-60">
            <CardContent>
              <p className="text-sm text-muted-foreground mt-2">
                Upload DFX File
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
