CREATE TABLE ad_assets (                                                  
id UUID NOT NULL DEFAULT gen_random_uuid(),                             
campaign_id UUID NOT NULL,                                              
asset_type TEXT NOT NULL,                                               
content TEXT,                                                           
metadata JSONB,                                                         
position INTEGER DEFAULT 1,                                             
status TEXT DEFAULT 'active'::text,                                     
created_at TIMESTAMPTZ DEFAULT now()                                    
);
CREATE TABLE campaign_issues (                                            
id UUID NOT NULL DEFAULT gen_random_uuid(),                             
campaign_id UUID NOT NULL,                                              
issue_type TEXT NOT NULL,                                               
field_name TEXT,                                                        
message TEXT NOT NULL,                                                  
resolved BOOLEAN DEFAULT false,                                         
created_at TIMESTAMPTZ DEFAULT now()                                    
);
CREATE TABLE campaign_targeting (                                         
id UUID NOT NULL DEFAULT gen_random_uuid(),                             
campaign_id UUID NOT NULL,                                              
targeting_type TEXT NOT NULL,                                           
targeting_data JSONB NOT NULL,                                          
created_at TIMESTAMPTZ DEFAULT now()                                    
);
CREATE TABLE google_ads_campaigns (                                       
id UUID NOT NULL DEFAULT gen_random_uuid(),                             
strategy_id UUID NOT NULL,                                              
name TEXT NOT NULL,                                                     
status TEXT DEFAULT 'draft'::text,                                      
budget_daily INTEGER,                                                   
budget_total INTEGER,                                                   
start_date DATE,                                                        
end_date DATE,                                                          
campaign_type TEXT DEFAULT 'search'::text,                              
target_locations TEXT[],                                                
ad_groups JSONB,                                                        
keywords_final TEXT[],                                                  
created_at TIMESTAMPTZ DEFAULT now(),                                   
updated_at TIMESTAMPTZ DEFAULT now(),                                   
campaign_objective TEXT,                                                
ad_type TEXT,                                                           
validation_status JSONB DEFAULT '{"errors": [], "warnings": []}'::jsonb,
estimated_reach INTEGER,                                                
estimated_clicks INTEGER,                                               
estimated_conversions INTEGER,                                          
quality_score INTEGER                                                   
);
CREATE TABLE marketing_strategies (                                       
id UUID NOT NULL DEFAULT gen_random_uuid(),                             
website_analysis_id UUID NOT NULL,                                      
title TEXT NOT NULL,                                                    
target_audience TEXT NOT NULL,                                          
budget_recommendation INTEGER NOT NULL,                                 
notes TEXT NOT NULL,                                                    
industry_override TEXT,                                                 
created_at TIMESTAMPTZ DEFAULT now(),                                   
updated_at TIMESTAMPTZ DEFAULT now()                                    
);
CREATE TABLE profiles (                                                   
id UUID NOT NULL,                                                       
role TEXT NOT NULL DEFAULT 'user'::text                                 
);
CREATE TABLE website_analyses (                                           
id UUID NOT NULL DEFAULT gen_random_uuid(),                             
url TEXT NOT NULL,                                                      
description TEXT NOT NULL,                                              
keywords TEXT[] NOT NULL,                                               
industry TEXT NOT NULL,                                                 
created_at TIMESTAMPTZ DEFAULT now(),                                   
updated_at TIMESTAMPTZ DEFAULT now()                                    
);
