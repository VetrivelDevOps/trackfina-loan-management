import api from './api';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email?: string;
  address?: string;
  idProofType?: string;
  idProofNumber?: string;
  branchId: string;
  groupId?: string;
  createdAt: string;
  isActive: boolean;
  activeLoans?: number;
}

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  mobile: string;
  email?: string;
  address?: string;
  idProofType?: string;
  idProofNumber?: string;
  branchId: string;
  groupId?: string;
  isActive?: boolean;
}

/**
 * Service class for customer-related API calls
 */
class CustomerService {
  /**
   * Get all customers
   * @returns Promise with array of customers
   */
  async getCustomers(): Promise<Customer[]> {
    // When API is ready, uncomment this line:
    // const response = await api.get('/customers');
    // return response.data;
    
    // For now, return mock data with delay to simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            mobile: '9876543210',
            email: 'john.doe@example.com',
            address: '123 Main St, Anytown, State, 12345',
            idProofType: 'Aadhaar',
            idProofNumber: '1234-5678-9012',
            branchId: '1',
            createdAt: '2023-01-15',
            isActive: true,
            activeLoans: 2,
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            mobile: '8765432109',
            email: 'jane.smith@example.com',
            branchId: '1',
            createdAt: '2023-02-20',
            isActive: true,
            activeLoans: 1,
          },
          {
            id: '3',
            firstName: 'Mike',
            lastName: 'Johnson',
            mobile: '7654321098',
            branchId: '1',
            createdAt: '2023-03-10',
            isActive: true,
            activeLoans: 0,
          },
          {
            id: '4',
            firstName: 'Priya',
            lastName: 'Patel',
            mobile: '6543210987',
            email: 'priya.patel@example.com',
            branchId: '2',
            createdAt: '2023-04-05',
            isActive: true,
            activeLoans: 1,
          },
          {
            id: '5',
            firstName: 'Rajesh',
            lastName: 'Kumar',
            mobile: '5432109876',
            branchId: '2',
            createdAt: '2023-05-12',
            isActive: true,
            activeLoans: 3,
          },
        ]);
      }, 1000);
    });
  }

  /**
   * Get a customer by ID
   * @param id Customer ID
   * @returns Promise with customer data
   */
  async getCustomerById(id: string): Promise<Customer> {
    // When API is ready, uncomment this line:
    // const response = await api.get(`/customers/${id}`);
    // return response.data;
    
    // For now, return mock data with delay to simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const customer = {
          id,
          firstName: 'John',
          lastName: 'Doe',
          mobile: '9876543210',
          email: 'john.doe@example.com',
          address: '123 Main St, Anytown, State, 12345',
          idProofType: 'Aadhaar',
          idProofNumber: '1234-5678-9012',
          branchId: '1',
          createdAt: '2023-01-15',
          isActive: true,
          activeLoans: 2,
        };
        resolve(customer);
      }, 1000);
    });
  }

  /**
   * Create a new customer
   * @param customerData Customer form data
   * @returns Promise with created customer data
   */
  async createCustomer(customerData: CustomerFormData): Promise<Customer> {
    // When API is ready, uncomment this line:
    // const response = await api.post('/customers', customerData);
    // return response.data;
    
    // For now, return mock data with delay to simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...customerData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          isActive: true,
          activeLoans: 0,
        } as Customer);
      }, 1000);
    });
  }

  /**
   * Update an existing customer
   * @param id Customer ID
   * @param customerData Customer form data
   * @returns Promise with updated customer data
   */
  async updateCustomer(id: string, customerData: CustomerFormData): Promise<Customer> {
    // When API is ready, uncomment this line:
    // const response = await api.put(`/customers/${id}`, customerData);
    // return response.data;
    
    // For now, return mock data with delay to simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...customerData,
          id,
          createdAt: '2023-01-15',
          activeLoans: 2,
        } as Customer);
      }, 1000);
    });
  }

  /**
   * Delete a customer
   * @param id Customer ID
   * @returns Promise with success status
   */
  async deleteCustomer(id: string): Promise<boolean> {
    // When API is ready, uncomment this line:
    // await api.delete(`/customers/${id}`);
    // return true;
    
    // For now, return success with delay to simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }

  /**
   * Get loans for a specific customer
   * @param customerId Customer ID
   * @returns Promise with array of customer's loans
   */
  async getCustomerLoans(customerId: string) {
    // When API is ready, uncomment this line:
    // const response = await api.get(`/customers/${customerId}/loans`);
    // return response.data;
    
    // For now, return mock data with delay to simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '101',
            principalAmount: 50000,
            disbursedAmount: 48000,
            interestRate: 12.5,
            startDate: '2023-02-01',
            endDate: '2023-08-01',
            status: 'ACTIVE',
          },
          {
            id: '102',
            principalAmount: 30000,
            disbursedAmount: 29000,
            interestRate: 10,
            startDate: '2023-03-15',
            endDate: '2023-09-15',
            status: 'ACTIVE',
          },
        ]);
      }, 1000);
    });
  }
}

export default new CustomerService();