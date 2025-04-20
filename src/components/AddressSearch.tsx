
import { useState } from "react";
import { MapPin, Search, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

type SearchResult = {
  TRACKNUM: string;
  ZIP: string;
  CITY: string;
  STREET: string;
  TYPE: string;
  LOW: string;
  HIGH: string;
  PPC: string;
};

export default function AddressSearch() {
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [streetType, setStreetType] = useState("");
  const [doorNumber, setDoorNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [matches, setMatches] = useState<SearchResult[]>([]);
  const [nearMatches, setNearMatches] = useState<SearchResult[]>([]);

  // Simulated search function (replace with actual API call)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    // Simulate API delay
    setTimeout(() => {
      // Mock data for demonstration
      if (zipCode === "12345" && city.toUpperCase() === "DEMO") {
        setMatches([{
          TRACKNUM: "R123_456",
          ZIP: "12345",
          CITY: "DEMO",
          STREET: "MAIN",
          TYPE: "ST",
          LOW: "100",
          HIGH: "200",
          PPC: "1W"
        }]);
      } else if (doorNumber !== "") {
        setNearMatches([{
          TRACKNUM: "R789_101",
          ZIP: zipCode,
          CITY: city.toUpperCase(),
          STREET: street.toUpperCase(),
          TYPE: streetType.toUpperCase(),
          LOW: "300",
          HIGH: "400",
          PPC: "2X"
        }]);
      }
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-4">
        <MapPin className="w-12 h-12 mx-auto text-blue-500 animate-bounce" />
        <h1 className="text-3xl font-bold tracking-tight">Address to PPC Lookup</h1>
        <p className="text-muted-foreground">
          Enter your address details to find matching PPC records
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ZIP Code (required)</label>
              <Input
                required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter ZIP code"
                pattern="[0-9]{5}"
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">City (required)</label>
              <Input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Street Name (optional)</label>
              <Input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Enter street name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Street Type (optional)</label>
              <Input
                value={streetType}
                onChange={(e) => setStreetType(e.target.value)}
                placeholder="e.g., ST, AVE, RD"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Door Number (optional)</label>
              <Input
                value={doorNumber}
                onChange={(e) => setDoorNumber(e.target.value)}
                placeholder="Enter door number"
                type="number"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSearching}
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

      {matches.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-xl font-semibold">Exact Matches</h2>
          {matches.map((match, index) => (
            <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Track Number</p>
                  <p className="font-medium">{match.TRACKNUM}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">PPC</p>
                  <p className="font-medium">{match.PPC}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">
                    {match.STREET} {match.TYPE}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Range</p>
                  <p className="font-medium">{match.LOW} - {match.HIGH}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {nearMatches.length > 0 && (
        <div className="space-y-4">
          <Alert>
            <AlertTitle>Near Matches Found</AlertTitle>
            <AlertDescription>
              We found some addresses that are close to your search criteria (±100 door numbers)
            </AlertDescription>
          </Alert>
          {nearMatches.map((match, index) => (
            <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Track Number</p>
                  <p className="font-medium">{match.TRACKNUM}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">PPC</p>
                  <p className="font-medium">{match.PPC}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">
                    {match.STREET} {match.TYPE}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Range</p>
                  <p className="font-medium">{match.LOW} - {match.HIGH}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isSearching && zipCode && city && matches.length === 0 && nearMatches.length === 0 && (
        <Alert>
          <AlertTitle>No Matches Found</AlertTitle>
          <AlertDescription>
            We couldn't find any matches for your search criteria. Please try different parameters.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
