import React, { useState } from "react";
import { Bookmark } from "@carbon/icons-react";

// Logo URLs for Thrissur companies (5 logos from public folder)
const thrissurLogos = ['/comp1.png', '/comp2.png', '/comp4.png', '/comp5.png', '/comp6.png'];

// Dummy company data to show when no real companies are found
const getDummyCompanies = (location) => {
  const locationName = location || "Location";
  return [
    {
      id: "dummy-1",
      name: "Tech Solutions Pvt Ltd",
      logoUrl: "/comp1.png",
      address: `${locationName}, India`,
      jobs: [
        {
          id: "dummy-job-1",
          title: "Senior Software Engineer",
          experience: "3-5 years"
        }
      ]
    },
    {
      id: "dummy-2",
      name: "Digital Innovations Inc",
      logoUrl: "/comp2.png",
      address: `${locationName}, India`,
      jobs: [
        {
          id: "dummy-job-2",
          title: "Product Designer",
          experience: "2-4 years"
        }
      ]
    },
    {
      id: "dummy-3",
      name: "Creative Works Studio",
      logoUrl: "/comp4.png",
      address: `${locationName}, India`,
      jobs: [
        {
          id: "dummy-job-3",
          title: "Frontend Developer",
          experience: "1-3 years"
        }
      ]
    },
    {
      id: "dummy-4",
      name: "Global Services Hub",
      logoUrl: "/comp5.png",
      address: `${locationName}, India`,
      jobs: [
        {
          id: "dummy-job-4",
          title: "Business Analyst",
          experience: "2-5 years"
        }
      ]
    },
    {
      id: "dummy-5",
      name: "Innovation Labs",
      logoUrl: "/comp6.png",
      address: `${locationName}, India`,
      jobs: [
        {
          id: "dummy-job-5",
          title: "Full Stack Developer",
          experience: "3-6 years"
        }
      ]
    }
  ];
};

/**
 * ListViewLayout Component
 * Displays search results as a list of all jobs from all companies
 * Used when user is in List view mode
 */
export default function ListViewLayout({ companies = [], extractedLocation = "", searchQuery = "" }) {
  const [hoveredJobId, setHoveredJobId] = useState(null);
  
  // If no companies found, use dummy data
  const displayCompanies = companies.length > 0 ? companies : getDummyCompanies(extractedLocation || searchQuery);
  
  // Flatten all jobs from all companies into a single list
  const allJobs = displayCompanies.flatMap(company => 
    (company.jobs || []).map(job => ({
      ...job,
      companyName: company.name,
      companyLogo: company.logoUrl || '/comp1.png',
      companyAddress: company.address,
      companyId: company.id
    }))
  );
  
  const totalJobsCount = allJobs.length;
  const searchTerm = extractedLocation || searchQuery || "your search";

  return (
    <div className="bg-white" style={{ 
      paddingBottom: '100px', 
      paddingLeft: '56px', 
      paddingRight: '56px',
      minHeight: '100vh',
      height: '100%'
    }}>
      {/* H1 with search query - same padding as row list */}
      <div className="p-4">
        <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-4" style={{ fontFamily: 'Open Sans' }}>
          {searchTerm}
        </h1>
        
        {/* Message showing job count */}
        <p className="text-base text-[#1A1A1A]" style={{ fontFamily: 'Open Sans' }}>
          I found {totalJobsCount} jobs for "{searchTerm}"
        </p>
      </div>
      
      {/* Job List - No borders, gaps, or shadows */}
      <div>
        {allJobs.map((job) => {
          const company = displayCompanies.find(c => c.id === job.companyId);
          const logoUrl = company ? (displayCompanies.indexOf(company) < thrissurLogos.length 
            ? thrissurLogos[displayCompanies.indexOf(company)] 
            : (company.logoUrl || '/comp1.png')) : '/comp1.png';
          
          return (
            <div
              key={job.id}
              className="p-4 transition-colors hover:bg-[#F5F5F5] cursor-pointer relative"
              style={{ 
                fontFamily: 'Open Sans',
                borderRadius: '16px',
                borderBottom: '0.5px solid #E5E5E5'
              }}
              onMouseEnter={() => setHoveredJobId(job.id)}
              onMouseLeave={() => setHoveredJobId(null)}
            >
              <div className="flex items-start gap-4">
                {/* Company Logo - Left Side */}
                <div className="flex-shrink-0">
                  <img
                    src={logoUrl}
                    alt={job.companyName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>
                
                {/* Job Details - Right Side */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Job Title and Company Name */}
                      <h3 className="text-base font-semibold text-[#1A1A1A] mb-1">
                        {job.title}
                      </h3>
                      <p className="text-sm text-[#575757] mb-2">
                        {job.companyName}
                      </p>
                      
                      {/* Location, Experience, and Posted Date - All in same line */}
                      <div className="flex items-center gap-4 text-sm text-[#575757]">
                        <span>{job.companyAddress}</span>
                        {job.experience && (
                          <span>{job.experience} experience</span>
                        )}
                        <span>Posted 2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Saved button - appears on hover in bottom right corner, icon only */}
              {hoveredJobId === job.id && (
                <button
                  className="absolute bottom-4 right-4 p-2 rounded-lg bg-white hover:bg-white transition-colors flex items-center justify-center"
                  style={{ fontFamily: 'Open Sans' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle save action here
                    console.log('Save job:', job.id);
                  }}
                  aria-label="Save job"
                >
                  <Bookmark size={16} style={{ color: '#575757' }} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

