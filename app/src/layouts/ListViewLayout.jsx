import React, { useState } from "react";

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
  const [activeTab, setActiveTab] = useState("Recommended");
  
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
    <div className="px-4" style={{ marginTop: '48px' }}>
      {/* Message showing job count */}
      <div className="mb-6">
        <p className="text-base text-[#1A1A1A]" style={{ fontFamily: 'Open Sans' }}>
          I found {totalJobsCount} jobs for "{searchTerm}"
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6 border-b border-[#E5E5E5]">
        {["Recommended", "All Jobs", "Saved", "Applied"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 text-sm font-medium transition-colors relative"
            style={{
              fontFamily: 'Open Sans',
              color: activeTab === tab ? '#7c00ff' : '#575757',
              borderBottom: activeTab === tab ? '2px solid #7c00ff' : '2px solid transparent',
              marginBottom: '-2px'
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Job List - No borders, gaps, or shadows */}
      <div>
        {allJobs.map((job, index) => {
          const company = displayCompanies.find(c => c.id === job.companyId);
          const logoUrl = company ? (displayCompanies.indexOf(company) < thrissurLogos.length 
            ? thrissurLogos[displayCompanies.indexOf(company)] 
            : (company.logoUrl || '/comp1.png')) : '/comp1.png';
          
          return (
            <div
              key={job.id}
              className="bg-white p-4"
              style={{ 
                fontFamily: 'Open Sans',
                borderTop: index > 0 ? '1px solid #E5E5E5' : 'none'
              }}
            >
              <div className="flex items-start gap-4">
                {/* Company Logo - Left Side */}
                <div className="flex-shrink-0">
                  <img
                    src={logoUrl}
                    alt={job.companyName}
                    className="w-16 h-16 rounded-lg object-cover"
                    style={{ border: '2px solid #87CEEB' }}
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
                      
                      {/* Location and Experience */}
                      <div className="flex items-center gap-4 text-sm text-[#575757]">
                        <span>{job.companyAddress}</span>
                        {job.experience && (
                          <span>{job.experience} experience</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Posted Date - Right End */}
                    <div className="text-right text-sm text-[#575757] flex-shrink-0">
                      <span>Posted 2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

