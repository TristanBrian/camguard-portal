
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InventoryStatistics from '@/components/admin/InventoryStatistics';

const Statistics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Statistics Dashboard</h1>
      </div>
      
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="website">Website</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory">
          <InventoryStatistics />
        </TabsContent>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <p className="text-gray-500">Sales analytics will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="website">
          <Card>
            <CardHeader>
              <CardTitle>Website Analytics</CardTitle>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <p className="text-gray-500">Website analytics will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
