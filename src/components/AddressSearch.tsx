import { useState } from "react";
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
import FileUpload from "./FileUpload";
import { AddressRecord, findMatches } from "@/services/fileService";
import { parseAddressString } from "@/utils/addressParser";

export default function AddressSearch() {
  const [singleLineAddress, setSingleLineAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [exactMatches, setExactMatches] = useState<AddressRecord[]>([]);
  const [nearMatches, setNearMatches] = useState<AddressRecord[]>([]);
  const [addressData, setAddressData] = useState<AddressRecord[]>([]);

  const handleFileLoaded = (data: AddressRecord[]) => {
    setAddressData(data);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    const parsedAddress = parseAddressString(singleLineAddress);
    
    if (!parsedAddress.zipCode || !parsedAddress.city) {
      setIsSearching(false);
      return;
    }

    const results = findMatches(addressData, {
      zipCode: parsedAddress.zipCode,
      city: parsedAddress.city,
      street: parsedAddress.street,
      streetType: parsedAddress.streetType,
      doorNumber: parsedAddress.doorNumber,
    });

    setExactMatches(results.exactMatches);
    setNearMatches(results.nearMatches);
    setIsSearching(false);
  };

  const handleDownloadNearMatches = () => {
    const csvContent = [
      ["TRACKNUM", "ZIP", "CITY", "STREET", "TYPE", "LOW", "HIGH", "PPC"],
      ...nearMatches.map(record => [
        record.TRACKNUM,
        record.ZIP,
        record.CITY,
        record.STREET,
        record.TYPE,
        record.LOW,
        record.HIGH,
        record.PPC
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-4">
        <MapPin className="w-12 h-12 mx-auto text-blue-500 animate-bounce" />
        <h1 className="text-3xl font-bold tracking-tight">Address to PPC Lookup</h1>
        <p className="text-muted-foreground">
          Enter your address to find matching PPC records
        </p>
      </div>

      {addressData.length === 0 ? (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">First, upload your address data file</h2>
          <FileUpload onFileLoaded={handleFileLoaded} />
        </Card>
      ) : (
        <Card className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter Full Address</label>
              <Input
                required
                value={singleLineAddress}
                onChange={(e) => setSingleLineAddress(e.target.value)}
                placeholder="e.g., 123 Main St, Houston, TX 77001"
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">
                Enter the full address including street number, name, city, state, and ZIP code
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSearching || !singleLineAddress.trim()}
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
          </form>
        </Card>
      )}

      {exactMatches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Exact Matches</h2>
          <AddressTable records={exactMatches} />
        </div>
      )}

      {nearMatches.length > 0 && (
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No exact match. Showing nearby matches (within ±200)</AlertTitle>
            <AlertDescription>
              We found some addresses that are close to your search criteria
            </AlertDescription>
          </Alert>
          <AddressTable records={nearMatches} />
          <Button variant="outline" onClick={handleDownloadNearMatches}>
            <Download className="h-4 w-4 mr-2" />
            Download Near Matches
          </Button>
        </div>
      )}

      {!isSearching && singleLineAddress.trim() && exactMatches.length === 0 && nearMatches.length === 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Matches Found</AlertTitle>
          <AlertDescription>
            We couldn't find any matches for your search criteria. Please try different parameters.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
