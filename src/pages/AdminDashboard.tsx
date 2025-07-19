import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, EyeOff, Database } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useUserRole();
  const navigate = useNavigate();
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    // Generate a simple API key for demonstration
    if (user && isAdmin) {
      setApiKey(`admin_${user.id.slice(0, 8)}_${Date.now().toString(36)}`);
    }
  }, [user, isAdmin]);

  if (loading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API Key copied to clipboard!");
  };

  const migrateTags = async () => {
    setIsMigrating(true);
    try {
      const { data, error } = await supabase.functions.invoke('migrate-tags-to-categories');
      
      if (error) {
        toast.error(`Migration failed: ${error.message}`);
        console.error('Migration error:', error);
      } else {
        const summary = data.summary;
        toast.success(
          `Migration completed! Created ${summary.newCategoriesCreated} new categories from ${summary.uniqueTags} unique tags.`
        );
        console.log('Migration result:', data);
      }
    } catch (error) {
      toast.error('Migration failed: Network error');
      console.error('Migration error:', error);
    } finally {
      setIsMigrating(false);
    }
  };

  const projectUrl = window.location.origin;

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage videos and API access</p>
        </div>
        <Button onClick={() => navigate("/")} variant="outline">
          Back to Videos
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* API Key Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              API Key
              <Badge variant="secondary">Admin</Badge>
            </CardTitle>
            <CardDescription>
              Use this API key to add videos via the REST API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Your API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="api-key"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  readOnly
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={copyApiKey}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Migration Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Migration Tools
              <Badge variant="secondary">Admin</Badge>
            </CardTitle>
            <CardDescription>
              Migrate existing video tags to categories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Migrate Video Tags to Categories</Label>
              <p className="text-sm text-muted-foreground">
                This will scan all videos and create categories for any tags that don't already exist as categories.
              </p>
              <Button 
                onClick={migrateTags}
                disabled={isMigrating}
                className="w-full"
              >
                <Database className="h-4 w-4 mr-2" />
                {isMigrating ? "Migrating..." : "Migrate Tags to Categories"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>API Documentation</CardTitle>
            <CardDescription>
              Available APIs for video and category management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Add Video API */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Add Video API</h3>
              <div className="space-y-2">
                <Label>Endpoint</Label>
                <code className="block p-2 bg-muted rounded text-sm">
                  POST https://cpushnwxfdvqlglzhxcb.supabase.co/functions/v1/add-video
                </code>
              </div>
              
              <div className="space-y-2">
                <Label>Headers</Label>
                <code className="block p-2 bg-muted rounded text-sm">
                  Content-Type: application/json<br/>
                  Authorization: Bearer {apiKey}
                </code>
              </div>

              <div className="space-y-2">
                <Label>Example curl command</Label>
                <Textarea
                  readOnly
                  rows={10}
                  value={`curl -X POST "https://cpushnwxfdvqlglzhxcb.supabase.co/functions/v1/add-video" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{
    "titel": "Video Title",
    "describtion": "Video description",
    "duration": "5:30",
    "embed": "<iframe>...</iframe>",
    "thumbnail": "https://example.com/thumb.jpg",
    "tag_1": "first tag",
    "tag_2": "second tag"
  }'`}
                  className="font-mono text-xs"
                />
              </div>
            </div>

            {/* Get Categories API */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Get All Categories with Images API</h3>
              <div className="space-y-2">
                <Label>Endpoint</Label>
                <code className="block p-2 bg-muted rounded text-sm">
                  GET https://cpushnwxfdvqlglzhxcb.supabase.co/functions/v1/get-categories-with-images
                </code>
              </div>
              
              <div className="space-y-2">
                <Label>Example curl command</Label>
                <Textarea
                  readOnly
                  rows={4}
                  value={`curl -X GET "https://cpushnwxfdvqlglzhxcb.supabase.co/functions/v1/get-categories-with-images"`}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label>Response Format</Label>
                <code className="block p-2 bg-muted rounded text-sm whitespace-pre">
{`{
  "success": true,
  "categories": [
    {
      "name": "category-name",
      "image_url": "https://example.com/image.jpg"
    }
  ]
}`}
                </code>
              </div>
            </div>

            {/* Update Category Image API */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Update Category Image API</h3>
              <div className="space-y-2">
                <Label>Endpoint</Label>
                <code className="block p-2 bg-muted rounded text-sm">
                  POST https://cpushnwxfdvqlglzhxcb.supabase.co/functions/v1/update-category-image
                </code>
              </div>
              
              <div className="space-y-2">
                <Label>Example curl command</Label>
                <Textarea
                  readOnly
                  rows={6}
                  value={`curl -X POST "https://cpushnwxfdvqlglzhxcb.supabase.co/functions/v1/update-category-image" \\
  -H "Content-Type: application/json" \\
  -d '{
    "categoryName": "category-name",
    "imageUrl": "https://example.com/new-image.jpg"
  }'`}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label>Required Fields</Label>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <code>categoryName</code> - Category name (string)</li>
                  <li>• <code>imageUrl</code> - Image URL (string)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;