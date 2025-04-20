import { useState, useEffect } from "react";
import { MapPin, Search, ArrowDown, AlertTriangle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import FileUpload from "./FileUpload";
import { AddressRecord, findMatches } from "@/services/fileService";
import { parseAddressString } from "@/utils/addressParser";
import RiskCategoryInfo from "./RiskCategoryInfo";

export default function AddressSearch() {
  const [singleLineAddress, setSingleLineAddress] = useState("");
  const [manualFields, setManualFields] = useState({
    zipCode: "",
    city: "",
    street: "",
    streetType: "",
    doorNumber: "",
  });
  const [isSearching, setIsSearching] = useState(false);
  const [exactMatches, setExactMatches] = useState<AddressRecord[]>([]);
  const [nearMatches, setNearMatches] = useState<AddressRecord[]>([]);
  const [addressData, setAddressData] = useState<AddressRecord[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFileLoaded = (data: AddressRecord[]) => {
    setAddressData(data);
  };

  useEffect(() => {
    if (singleLineAddress) {
      const parsedAddress = parseAddressString(singleLineAddress);
      setManualFields({
        zipCode: parsedAddress.zipCode || "",
        city: parsedAddress.city || "",
        street: parsedAddress.street || "",
        streetType: parsedAddress.streetType || "",
        doorNumber: parsedAddress.doorNumber || "",
      });
    }
  }, [singleLineAddress]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);
    performSearch(manualFields);
  };

  const performSearch = (criteria: any) => {
    if (!criteria.zipCode || !criteria.city) {
      setIsSearching(false);
      return;
    }

    const results = findMatches(addressData, criteria);
    
    if (results.exactMatches.length > 0) {
      setExactMatches(results.exactMatches);
      setNearMatches([]);
    } else {
      setExactMatches([]);
      setNearMatches(results.nearMatches);
    }
    
    setIsSearching(false);
  };

  const handleDownloadNearMatches = () => {
    const csvContent = [
      ["TRACKNUM", "ZIP", "CITY", "STREET", "TYPE", "LOW", "HIGH", "PPC", "ALT_PPC", "FS", "RISK"],
      ...nearMatches.map(record => [
        record.TRACKNUM,
        record.ZIP,
        record.CITY,
        record.STREET,
        record.TYPE,
        record.LOW,
        record.HIGH,
        record.PPC,
        record.ALT_PPC,
        record.FS,
        record.RISK_CATEGORY
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "near_matches.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getRiskBadgeColor = (riskCategory: string) => {
    switch(riskCategory) {
      case 'Low Risk':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderate Risk':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High Risk':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const AddressTable = ({ records }: { records: AddressRecord[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>TRACKNUM</TableHead>
          <TableHead>ZIP</TableHead>
          <TableHead>CITY</TableHead>
          <TableHead>STREET</TableHead>
          <TableHead>TYPE</TableHead>
          <TableHead>LOW</TableHead>
          <TableHead>HIGH</TableHead>
          <TableHead>PPC</TableHead>
          <TableHead>ALT_PPC</TableHead>
          <TableHead>FS</TableHead>
          <TableHead>RISK</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record, index) => (
          <TableRow key={index}>
            <TableCell>{record.TRACKNUM}</TableCell>
            <TableCell>{record.ZIP}</TableCell>
            <TableCell>{record.CITY}</TableCell>
            <TableCell>{record.STREET}</TableCell>
            <TableCell>{record.TYPE}</TableCell>
            <TableCell>{record.LOW}</TableCell>
            <TableCell>{record.HIGH}</TableCell>
            <TableCell className="font-medium bg-yellow-100">{record.PPC}</TableCell>
            <TableCell className="font-medium bg-blue-100">{record.ALT_PPC || "N/A"}</TableCell>
            <TableCell>{record.FS || "N/A"}</TableCell>
            <TableCell>
              {record.RISK_CATEGORY && (
                <Badge className={getRiskBadgeColor(record.RISK_CATEGORY)}>
                  {record.RISK_CATEGORY}
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const handleDownloadExactMatches = () => {
    const csvContent = [
      ["TRACKNUM", "ZIP", "CITY", "STREET", "TYPE", "LOW", "HIGH", "PPC", "ALT_PPC", "FS", "RISK"],
      ...exactMatches.map(record => [
        record.TRACKNUM,
        record.ZIP,
        record.CITY,
        record.STREET,
        record.TYPE,
        record.LOW,
        record.HIGH,
        record.PPC,
        record.ALT_PPC,
        record.FS,
        record.RISK_CATEGORY
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exact_matches.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-8">
      {addressData.length === 0 ? (
        <Card className="p-8 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">First, upload your address data file</h2>
          <FileUpload onFileLoaded={handleFileLoaded} />
        </Card>
      ) : (
        <form onSubmit={handleSearch} className="space-y-8">
          <Card className="p-8 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg">
            <div className="grid gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Enter Full Address</label>
                <div className="relative">
                  <Input
                    value={singleLineAddress}
                    onChange={(e) => setSingleLineAddress(e.target.value)}
                    placeholder="e.g., 2794 Voss, Addison, TX 75001"
                    className="text-lg pl-10"
                  />
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                  <Input
                    value={manualFields.zipCode}
                    readOnly
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">City Name</label>
                  <Input
                    value={manualFields.city}
                    readOnly
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Street Name</label>
                  <Input
                    value={manualFields.street}
                    readOnly
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Street Type</label>
                  <Input
                    value={manualFields.streetType}
                    readOnly
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Door Number</label>
                  <Input
                    value={manualFields.doorNumber}
                    readOnly
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              disabled={isSearching || !manualFields.zipCode || !manualFields.city}
            >
              {isSearching ? (
                <span className="flex items-center">
                  Searching...
                  <ArrowDown className="ml-2 h-4 w-4 animate-bounce" />
                </span>
              ) : (
                <span className="flex items-center">
                  Search
                  <Search className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </Card>
        </form>
      )}

      {exactMatches.length > 0 && (
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Exact Matches</h2>
          <div className="rounded-lg overflow-hidden border border-gray-200 mb-4">
            <AddressTable records={exactMatches} />
          </div>
          <Button 
            variant="outline" 
            onClick={handleDownloadExactMatches}
            className="w-full sm:w-auto hover:bg-gray-100"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Exact Matches
          </Button>
        </Card>
      )}

      {nearMatches.length > 0 && (
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg">
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No exact match. Showing nearby matches (within ±200)</AlertTitle>
            <AlertDescription>
              We found some addresses that are close to your search criteria
            </AlertDescription>
          </Alert>
          <div className="rounded-lg overflow-hidden border border-gray-200 mb-4">
            <AddressTable records={nearMatches} />
          </div>
          <Button 
            variant="outline" 
            onClick={handleDownloadNearMatches}
            className="w-full sm:w-auto hover:bg-gray-100"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Near Matches
          </Button>
        </Card>
      )}

      {!isSearching && hasSearched && exactMatches.length === 0 && nearMatches.length === 0 && (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Matches Found</AlertTitle>
          <AlertDescription>
            We couldn't find any matches for your search criteria. Please try different parameters.
          </AlertDescription>
        </Alert>
      )}

      {(exactMatches.length > 0 || nearMatches.length > 0) && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Understanding Risk Categories</h2>
          <RiskCategoryInfo />
        </div>
      )}
    </div>
  );
}
