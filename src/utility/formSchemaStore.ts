// store/formSchemaStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FormSchema {
  [key: string]: any;
}

interface SchemaProcess {
  id: string;
  title: string;
  schema: FormSchema;
}

type UnregisterMode = 'all' | 'data';

interface FormSchemaStore {
  processes: Record<string, SchemaProcess>;
  formData: Record<string, any>;
  
  register: (process: SchemaProcess) => void;
  unregister: (processId: string, mode?: UnregisterMode) => void;
  get: (processId: string) => SchemaProcess | null;
  getSchemaFragment: (path: string) => any;
  setData: (processId: string, data: any) => void;
  getData: (processId: string) => any;
  reset: (processId: string) => void;
}

export const useFormSchemaStore = create<FormSchemaStore>()(
  persist(
    (set, get) => ({
      processes: {},
      formData: {},
      
      register: (process) => set(state => ({
        processes: { ...state.processes, [process.id]: process }
      })),
      
      unregister: (processId, mode = 'all') => set(state => {
        switch (mode) {
          case 'all': {
            // Usuwa schemat i dane
            const { [processId]: removedProcess, ...restProcesses } = state.processes;
            const { [processId]: removedData, ...restData } = state.formData;
            return { processes: restProcesses, formData: restData };
          }
            
          case 'data': {
            // Usuwa tylko dane, zostawia schemat
            const { [processId]: removedDataOnly, ...restDataOnly } = state.formData;
            return { ...state, formData: restDataOnly };
          }
            
          default:
            return state;
        }
      }),
      
      get: (processId) => get().processes[processId] || null,
      
      getSchemaFragment: (path) => {
        const [processId, ...fragmentPath] = path.split('.');
        const process = get().processes[processId];
        if (!process) return null;
        
        let fragment = process.schema;
        for (const key of fragmentPath) {
          fragment = fragment?.[key];
        }
        return fragment;
      },
      
      setData: (processId, data) => set(state => ({
        formData: { ...state.formData, [processId]: { ...state.formData[processId], ...data } }
      })),
      
      getData: (processId) => get().formData[processId] || {},
      
      reset: (processId) => set(state => ({
        formData: { ...state.formData, [processId]: {} }
      }))
    }),
    {
      name: "form-schema-store",
      version: 1
    }
  )
);