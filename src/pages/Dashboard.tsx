
import { 
  AlertCircle, 
  Package, 
  FileText, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Building,
  Stethoscope,
  Activity,
  Filter,
  BarChart3
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { dashboardApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockReports, mockInventoryItems, mockTransactions, dentalClinicsData } from '@/data/mockData';

// Mock facilities data
const mockFacilities = [
  { id: 1, name: 'مركز صحي الملز', code: 'RC001', location: 'حي الملز', sector: 'الرياض', type: 'الرياض - مراكز شرق', totalClinics: 8, working: 7, outOfOrder: 1, notWorking: 0, isActive: true },
  { id: 2, name: 'مستشفى الملك فهد', code: 'KFH001', location: 'شمال الرياض', sector: 'الرياض', type: 'الرياض - مستشفى', totalClinics: 25, working: 23, outOfOrder: 1, notWorking: 1, isActive: true },
  { id: 3, name: 'مركز الزلفي الصحي', code: 'ZC001', location: 'الزلفي', sector: 'الزلفي', type: 'مركز صحي', totalClinics: 12, working: 11, outOfOrder: 0, notWorking: 1, isActive: true },
];

export default function Dashboard() {
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedFacilityType, setSelectedFacilityType] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [newFacility, setNewFacility] = useState({
    name: '',
    code: '',
    location: '',
    sector: '',
    type: '',
    totalClinics: 0,
    working: 0,
    outOfOrder: 0,
    notWorking: 0,
    isActive: true
  });

  // Load dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading dashboard data from API...');
        
        // Load all dashboard data in parallel
        const [dashboardResponse, facilitiesResponse, reportsResponse] = await Promise.all([
          dashboardApi.getDashboardData(),
          dashboardApi.getFacilities(),
          dashboardApi.getRecentReports()
        ]);
        
        console.log('✅ API data loaded successfully:', {
          dashboard: dashboardResponse.data,
          facilities: facilitiesResponse.data,
          reports: reportsResponse.data
        });
        
        setDashboardStats(dashboardResponse.data);
        setFacilities(facilitiesResponse.data || []);
        setRecentReports(reportsResponse.data || []);
        
        toast({
          title: "تم تحميل البيانات من الخادم",
          description: "تم تحميل جميع بيانات لوحة التحكم بنجاح من الـ API",
        });
      } catch (error: any) {
        console.error('❌ Error loading dashboard data:', error);
        console.log('🔄 Falling back to mock data...');
        
        toast({
          title: "تعذر الاتصال بالخادم",
          description: "سيتم استخدام البيانات التجريبية حتى يصبح الخادم متاحاً",
          variant: "destructive",
        });
        
        // Fallback to mock data
        setFacilities(mockFacilities);
        setRecentReports(mockReports.slice(0, 5));
        setDashboardStats({
          total_clinics: 150,
          working_clinics: 135,
          not_working_clinics: 10,
          out_of_order_clinics: 5,
          total_facilities: 12
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [toast]);

  // Calculate dynamic statistics
  const totalClinics = facilities.reduce((sum: number, f: any) => sum + f.totalClinics, 0);
  const totalWorking = facilities.reduce((sum: number, f: any) => sum + f.working, 0);
  const totalNotWorking = facilities.reduce((sum: number, f: any) => sum + f.notWorking, 0);
  const totalOutOfOrder = facilities.reduce((sum: number, f: any) => sum + f.outOfOrder, 0);
  const totalFacilities = facilities.length;

  // Filter facilities
  const filteredFacilities = facilities.filter((f: any) => {
    return (!selectedSector || selectedSector === 'all-sectors' || f.sector === selectedSector) &&
           (!selectedFacilityType || selectedFacilityType === 'all-types' || f.type === selectedFacilityType);
  });

  // Group by sector and type for display
  const groupedBySector = filteredFacilities.reduce((acc: any, f: any) => {
    if (!acc[f.sector]) acc[f.sector] = {};
    if (!acc[f.sector][f.type]) acc[f.sector][f.type] = { count: 0, clinics: 0 };
    acc[f.sector][f.type].count++;
    acc[f.sector][f.type].clinics += f.totalClinics;
    return acc;
  }, {} as Record<string, Record<string, { count: number; clinics: number }>>);

  const handleAddFacility = async () => {
    if (newFacility.name && newFacility.code) {
      try {
        console.log('🔄 Adding new facility via API...', newFacility);
        
        const response = await dashboardApi.registerFacility(newFacility);
        
        console.log('✅ Facility added successfully:', response.data);
        
        // Add the new facility to the list with the returned ID
        const addedFacility = { ...newFacility, id: response.data?.id || Date.now() };
        setFacilities([...facilities, addedFacility]);
        
        setNewFacility({
          name: '',
          code: '',
          location: '',
          sector: '',
          type: '',
          totalClinics: 0,
          working: 0,
          outOfOrder: 0,
          notWorking: 0,
          isActive: true
        });
        setIsAddDialogOpen(false);
        
        toast({
          title: "تم حفظ المنشأة عبر الـ API",
          description: "تم تسجيل المنشأة الجديدة بنجاح في قاعدة البيانات",
        });
      } catch (error: any) {
        console.error('❌ Error adding facility via API:', error);
        console.log('🔄 Adding facility locally as fallback...');
        
        // Fallback to local addition
        const addedFacility = { ...newFacility, id: Date.now() };
        setFacilities([...facilities, addedFacility]);
        
        setNewFacility({
          name: '',
          code: '',
          location: '',
          sector: '',
          type: '',
          totalClinics: 0,
          working: 0,
          outOfOrder: 0,
          notWorking: 0,
          isActive: true
        });
        setIsAddDialogOpen(false);
        
        toast({
          title: "تم حفظ المنشأة محلياً",
          description: "تعذر الاتصال بالخادم، تم الحفظ محلياً",
          variant: "destructive",
        });
      }
    }
  };

  const sectors = ['الرياض', 'الزلفي', 'رماح', 'حوطة سدير', 'تمير', 'الغاط', 'المجمعة', 'الأرطاوية'];
  const facilityTypes = {
    'الرياض': ['الرياض - مراكز شرق', 'الرياض - مراكز شمال', 'الرياض - مركز تخصصي', 'الرياض - مستشفى'],
    'other': ['مركز صحي', 'مستشفى']
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-4 sm:p-6 text-primary-foreground shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-right">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">لوحة التحكم الرئيسية</h1>
            <p className="text-primary-foreground/90 text-sm sm:text-base">لوحة تحكم خاصة لجميع عيادات الأسنان بتجمع الرياض الصحي الثاني</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm">
              <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full">مرحباً بك</span>
            </div>
            <div className="relative group">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 p-2 sm:px-3 sm:py-2"
                onClick={() => {
                  if (confirm('هل تريد تسجيل الخروج؟')) {
                    window.location.href = '/login';
                  }
                }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline mr-2">تسجيل الخروج</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dental Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs sm:text-sm font-medium opacity-90">مجموع العيادات الكلي</p>
                <p className="text-xl sm:text-2xl font-bold">{totalClinics}</p>
              </div>
              <Stethoscope className="h-6 w-6 sm:h-8 sm:w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs sm:text-sm font-medium opacity-90">العيادات التي تعمل</p>
                <p className="text-xl sm:text-2xl font-bold">{totalWorking}</p>
              </div>
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs sm:text-sm font-medium opacity-90">العيادات التي لا تعمل</p>
                <p className="text-xl sm:text-2xl font-bold">{totalNotWorking}</p>
              </div>
              <XCircle className="h-6 w-6 sm:h-8 sm:w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs sm:text-sm font-medium opacity-90">العيادات المكهنة</p>
                <p className="text-xl sm:text-2xl font-bold">{totalOutOfOrder}</p>
              </div>
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs sm:text-sm font-medium opacity-90">جميع المنشآت</p>
                <p className="text-xl sm:text-2xl font-bold">{totalFacilities}</p>
              </div>
              <Building className="h-6 w-6 sm:h-8 sm:w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Add Facility */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-right flex items-center gap-2 text-sm sm:text-base">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              تصفية البيانات وإدارة المنشآت
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">تسجيل منشأة جديدة</span>
                  <span className="sm:hidden">منشأة جديدة</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-2">
                <DialogHeader>
                  <DialogTitle className="text-right">تسجيل منشأة جديدة</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 text-right">
                      <Label htmlFor="name" className="text-sm">اسم المنشأة</Label>
                      <Input
                        id="name"
                        value={newFacility.name}
                        onChange={(e) => setNewFacility({...newFacility, name: e.target.value})}
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2 text-right">
                      <Label htmlFor="code" className="text-sm">رمز المنشأة</Label>
                      <Input
                        id="code"
                        value={newFacility.code}
                        onChange={(e) => setNewFacility({...newFacility, code: e.target.value})}
                        className="text-right"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 text-right">
                      <Label htmlFor="location" className="text-sm">الموقع</Label>
                      <Input
                        id="location"
                        value={newFacility.location}
                        onChange={(e) => setNewFacility({...newFacility, location: e.target.value})}
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2 text-right">
                      <Label htmlFor="sector" className="text-sm">القطاع</Label>
                      <Select value={newFacility.sector} onValueChange={(value) => setNewFacility({...newFacility, sector: value, type: ''})}>
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اختر القطاع" />
                        </SelectTrigger>
                        <SelectContent>
                          {sectors.map((sector) => (
                            <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <Label htmlFor="type" className="text-sm">نوع المنشأة</Label>
                    <Select value={newFacility.type} onValueChange={(value) => setNewFacility({...newFacility, type: value})}>
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="اختر نوع المنشأة" />
                      </SelectTrigger>
                      <SelectContent>
                        {(newFacility.sector === 'الرياض' ? facilityTypes['الرياض'] : facilityTypes['other']).map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2 text-right">
                      <Label htmlFor="totalClinics" className="text-sm">مجموع العيادات</Label>
                      <Input
                        id="totalClinics"
                        type="number"
                        value={newFacility.totalClinics}
                        onChange={(e) => setNewFacility({...newFacility, totalClinics: parseInt(e.target.value) || 0})}
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2 text-right">
                      <Label htmlFor="working" className="text-sm">يعمل</Label>
                      <Input
                        id="working"
                        type="number"
                        value={newFacility.working}
                        onChange={(e) => setNewFacility({...newFacility, working: parseInt(e.target.value) || 0})}
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2 text-right">
                      <Label htmlFor="outOfOrder" className="text-sm">مكهن</Label>
                      <Input
                        id="outOfOrder"
                        type="number"
                        value={newFacility.outOfOrder}
                        onChange={(e) => setNewFacility({...newFacility, outOfOrder: parseInt(e.target.value) || 0})}
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2 text-right">
                      <Label htmlFor="notWorking" className="text-sm">لا يعمل</Label>
                      <Input
                        id="notWorking"
                        type="number"
                        value={newFacility.notWorking}
                        onChange={(e) => setNewFacility({...newFacility, notWorking: parseInt(e.target.value) || 0})}
                        className="text-right"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <Label htmlFor="isActive" className="text-sm">نشاط المنشأة</Label>
                    <Select value={newFacility.isActive.toString()} onValueChange={(value) => setNewFacility({...newFacility, isActive: value === 'true'})}>
                      <SelectTrigger className="text-right">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">نشطة</SelectItem>
                        <SelectItem value="false">غير نشطة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
                  <Button onClick={handleAddFacility}>حفظ</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2 text-right">
              <Label className="text-sm">القطاع</Label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر القطاع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-sectors">جميع القطاعات</SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 text-right">
              <Label className="text-sm">نوع المنشأة</Label>
              <Select value={selectedFacilityType} onValueChange={setSelectedFacilityType}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر نوع المنشأة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">جميع الأنواع</SelectItem>
                  {[...facilityTypes['الرياض'], ...facilityTypes['other']].map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sector Statistics */}
          {selectedSector && selectedSector !== 'all-sectors' && (
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-right">إحصائيات قطاع {selectedSector}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {Object.entries(groupedBySector[selectedSector] || {}).map(([type, data]) => (
                  <Card key={type}>
                    <CardContent className="p-3 sm:p-4 text-right">
                      <div className="text-xs sm:text-sm text-muted-foreground">{type}</div>
                      <div className="text-lg sm:text-2xl font-bold">{(data as any).count}</div>
                      <div className="text-xs text-muted-foreground">{(data as any).clinics} عيادة</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Facilities Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right text-sm sm:text-base">قائمة المنشآت</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border text-right bg-muted/50">
                  <th className="p-2 sm:p-3 font-medium whitespace-nowrap">اسم المنشأة</th>
                  <th className="p-2 sm:p-3 font-medium whitespace-nowrap">الرمز</th>
                  <th className="p-2 sm:p-3 font-medium whitespace-nowrap">القطاع</th>
                  <th className="p-2 sm:p-3 font-medium whitespace-nowrap">النوع</th>
                  <th className="p-2 sm:p-3 font-medium whitespace-nowrap">المجموع</th>
                  <th className="p-2 sm:p-3 font-medium whitespace-nowrap">يعمل</th>
                  <th className="p-2 sm:p-3 font-medium whitespace-nowrap">مكهن</th>
                  <th className="p-2 sm:p-3 font-medium whitespace-nowrap">لا يعمل</th>
                  <th className="p-2 sm:p-3 font-medium whitespace-nowrap">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filteredFacilities.map((facility: any) => (
                  <tr key={facility.id} className="border-b border-border text-right hover:bg-muted/30">
                    <td className="p-2 sm:p-3 font-medium">{facility.name}</td>
                    <td className="p-2 sm:p-3">{facility.code}</td>
                    <td className="p-2 sm:p-3">{facility.sector}</td>
                    <td className="p-2 sm:p-3">{facility.type}</td>
                    <td className="p-2 sm:p-3">{facility.totalClinics}</td>
                    <td className="p-2 sm:p-3 text-green-600">{facility.working}</td>
                    <td className="p-2 sm:p-3 text-orange-600">{facility.outOfOrder}</td>
                    <td className="p-2 sm:p-3 text-red-600">{facility.notWorking}</td>
                    <td className="p-2 sm:p-3">
                      <Badge variant={facility.isActive ? 'default' : 'secondary'} className="text-xs whitespace-nowrap">
                        {facility.isActive ? 'نشطة' : 'غير نشطة'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right text-sm sm:text-base">البلاغات الحديثة</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border text-right bg-muted/50">
                  <th className="p-2 sm:p-3 font-medium whitespace-nowrap">رقم البلاغ</th>
                  <th className="p-2 sm:p-3 font-medium whitespace-nowrap">المنشأة</th>
                  <th className="p-2 sm:p-3 font-medium whitespace-nowrap">الفئة</th>
                  <th className="p-2 sm:p-3 font-medium whitespace-nowrap">التاريخ</th>
                  <th className="p-2 sm:p-3 font-medium whitespace-nowrap">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.slice(0, 5).map((report: any) => (
                  <tr key={report.id} className="border-b border-border text-right hover:bg-muted/30">
                    <td className="p-2 sm:p-3 font-medium">{report.id}</td>
                    <td className="p-2 sm:p-3">{report.facilityName}</td>
                    <td className="p-2 sm:p-3">{report.category}</td>
                    <td className="p-2 sm:p-3 whitespace-nowrap">{report.reportDate}</td>
                    <td className="p-2 sm:p-3">
                      <Badge variant={
                        report.status === 'مفتوح' ? 'secondary' :
                        report.status === 'مغلق' ? 'default' : 'destructive'
                      } className="text-xs whitespace-nowrap">
                        {report.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2 text-sm sm:text-base">
            <TrendingUp className="h-4 w-4" />
            الإجراءات السريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <button 
              onClick={() => window.location.href = '/reports/new'}
              className="group bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-4 sm:p-6 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="bg-white/20 p-2 sm:p-3 rounded-full group-hover:bg-white/30 transition-all">
                  <AlertCircle className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <span className="text-xs sm:text-sm font-medium">بلاغ جديد</span>
              </div>
            </button>
            <button 
              onClick={() => window.location.href = '/dental/assets'}
              className="group bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 sm:p-6 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="bg-white/20 p-2 sm:p-3 rounded-full group-hover:bg-white/30 transition-all">
                  <Package className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <span className="text-xs sm:text-sm font-medium">إضافة أصل</span>
              </div>
            </button>
            <button 
              onClick={() => window.location.href = '/transactions/new'}
              className="group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 sm:p-6 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="bg-white/20 p-2 sm:p-3 rounded-full group-hover:bg-white/30 transition-all">
                  <FileText className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <span className="text-xs sm:text-sm font-medium">معاملة جديدة</span>
              </div>
            </button>
            <button 
              onClick={() => window.location.href = '/reports/dashboard'}
              className="group bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-4 sm:p-6 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="bg-white/20 p-2 sm:p-3 rounded-full group-hover:bg-white/30 transition-all">
                  <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <span className="text-xs sm:text-sm font-medium">التقارير</span>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
