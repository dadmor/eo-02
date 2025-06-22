CREATE TABLE audit_requests (                   
id UUID NOT NULL DEFAULT gen_random_uuid(),   
beneficiary_id UUID NOT NULL,                 
postal_code TEXT NOT NULL,                    
city TEXT NOT NULL,                           
street_address TEXT NOT NULL,                 
phone_number TEXT NOT NULL,                   
status TEXT NOT NULL DEFAULT 'pending'::text, 
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now() 
);
CREATE TABLE auditor_offers (                   
id UUID NOT NULL DEFAULT gen_random_uuid(),   
request_id UUID NOT NULL,                     
auditor_id UUID NOT NULL,                     
price NUMERIC NOT NULL,                       
duration_days INTEGER NOT NULL,               
status TEXT NOT NULL DEFAULT 'pending'::text, 
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
description TEXT                              
);
CREATE TABLE auditor_portfolios (               
id UUID NOT NULL DEFAULT gen_random_uuid(),   
auditor_id UUID NOT NULL,                     
name_or_company TEXT NOT NULL,                
certificate_data TEXT,                        
description TEXT,                             
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now() 
);
CREATE TABLE contractor_gallery (               
id UUID NOT NULL DEFAULT gen_random_uuid(),   
portfolio_id UUID NOT NULL,                   
image_url TEXT NOT NULL,                      
caption TEXT,                                 
created_at TIMESTAMPTZ NOT NULL DEFAULT now() 
);
CREATE TABLE contractor_offers (                
id UUID NOT NULL DEFAULT gen_random_uuid(),   
request_id UUID NOT NULL,                     
contractor_id UUID NOT NULL,                  
price NUMERIC NOT NULL,                       
scope TEXT NOT NULL,                          
status TEXT NOT NULL DEFAULT 'pending'::text, 
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now() 
);
CREATE TABLE contractor_portfolios (            
id UUID NOT NULL DEFAULT gen_random_uuid(),   
contractor_id UUID NOT NULL,                  
company_name TEXT NOT NULL,                   
nip TEXT NOT NULL,                            
company_address TEXT NOT NULL,                
description TEXT,                             
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now() 
);
CREATE TABLE efficiency_audits (                
id UUID NOT NULL DEFAULT gen_random_uuid(),   
service_request_id UUID NOT NULL,             
file_url TEXT NOT NULL,                       
uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE moderation_logs (                  
id UUID NOT NULL DEFAULT gen_random_uuid(),   
operator_id UUID NOT NULL,                    
target_table TEXT NOT NULL,                   
target_id UUID NOT NULL,                      
action TEXT NOT NULL,                         
reason TEXT,                                  
created_at TIMESTAMPTZ NOT NULL DEFAULT now() 
);
CREATE TABLE opinions (                         
id UUID NOT NULL DEFAULT gen_random_uuid(),   
beneficiary_id UUID NOT NULL,                 
target_id UUID NOT NULL,                      
rating INTEGER NOT NULL,                      
comment TEXT,                                 
created_at TIMESTAMPTZ NOT NULL DEFAULT now() 
);
CREATE TABLE points_transactions (              
id UUID NOT NULL DEFAULT gen_random_uuid(),   
user_id UUID NOT NULL,                        
change INTEGER NOT NULL,                      
reason TEXT NOT NULL,                         
created_at TIMESTAMPTZ NOT NULL DEFAULT now() 
);
CREATE TABLE reports (                          
id UUID NOT NULL DEFAULT gen_random_uuid(),   
operator_id UUID NOT NULL,                    
title TEXT NOT NULL,                          
payload JSONB NOT NULL,                       
created_at TIMESTAMPTZ NOT NULL DEFAULT now() 
);
CREATE TABLE service_requests (                 
id UUID NOT NULL DEFAULT gen_random_uuid(),   
beneficiary_id UUID NOT NULL,                 
postal_code TEXT NOT NULL,                    
city TEXT NOT NULL,                           
street_address TEXT NOT NULL,                 
phone_number TEXT NOT NULL,                   
heat_source TEXT,                             
windows_count INTEGER,                        
doors_count INTEGER,                          
wall_insulation_m2 INTEGER,                   
attic_insulation_m2 INTEGER,                  
audit_file_url TEXT,                          
status TEXT NOT NULL DEFAULT 'pending'::text, 
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now() 
);
CREATE TABLE user_points (                      
id UUID NOT NULL DEFAULT gen_random_uuid(),   
user_id UUID NOT NULL,                        
balance INTEGER NOT NULL DEFAULT 0,           
updated_at TIMESTAMPTZ NOT NULL DEFAULT now() 
);
CREATE TABLE user_profiles (                    
id UUID NOT NULL DEFAULT gen_random_uuid(),   
user_id UUID NOT NULL,                        
name TEXT NOT NULL,                           
phone_number TEXT,                            
postal_code TEXT,                             
city TEXT,                                    
address TEXT,                                 
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now() 
);
CREATE TABLE users (                            
id UUID NOT NULL,                             
email TEXT NOT NULL,                          
role TEXT NOT NULL,                           
created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
first_name TEXT,                              
last_name TEXT,                               
phone_number TEXT,                            
city TEXT,                                    
postal_code TEXT,                             
name TEXT,                                    
street_address TEXT                           
);
