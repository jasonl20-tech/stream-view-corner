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
import { Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useUserRole();
  const navigate = useNavigate();
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("");

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

        {/* API Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>API Documentation</CardTitle>
            <CardDescription>
              How to add videos using curl commands
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Endpoint</Label>
              <code className="block p-2 bg-muted rounded text-sm">
                POST {projectUrl}/api/add-video
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
                rows={20}
                value={`curl -X POST "${projectUrl}/api/add-video" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{
    "titel": "Video Title",
    "describtion": "Video description",
    "duration": "5:30",
    "embed": "<iframe>...</iframe>",
    "thumbnail": "https://example.com/thumb.jpg",
    "tag_1": "first tag",
    "tag_2": "second tag",
    "tag_3": "third tag",
    "tag_4": "fourth tag",
    "tag_5": "fifth tag",
    "tag_6": "sixth tag",
    "tag_7": "seventh tag",
    "tag_8": "eighth tag",
    "image_1": "https://example.com/img1.jpg",
    "image_2": "https://example.com/img2.jpg",
    "image_3": "https://example.com/img3.jpg",
    "image_4": "https://example.com/img4.jpg",
    "image_5": "https://example.com/img5.jpg",
    "image_6": "https://example.com/img6.jpg",
    "image_7": "https://example.com/img7.jpg",
    "image_8": "https://example.com/img8.jpg",
    "image_9": "https://example.com/img9.jpg",
    "image_10": "https://example.com/img10.jpg",
    "image_11": "https://example.com/img11.jpg",
    "image_12": "https://example.com/img12.jpg",
    "image_13": "https://example.com/img13.jpg",
    "image_14": "https://example.com/img14.jpg"
  }'`}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label>Required Fields</Label>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <code>titel</code> - Video title (string)</li>
                <li>• <code>duration</code> - Video duration (string)</li>
                <li>• <code>embed</code> - Video embed code (string)</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label>Optional Fields</Label>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <code>describtion</code> - Description (string)</li>
                <li>• <code>thumbnail</code> - Thumbnail URL (string)</li>
                <li>• <code>tag_1</code> to <code>tag_8</code> - Individual tags (string)</li>
                <li>• <code>image_1</code> to <code>image_14</code> - Individual image URLs (string)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;