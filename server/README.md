# Go-Bus API

This is a README file for testing the Go-Bus API routes using Postman.

## Prerequisites

- Python and Flask installed
- The Go-Bus API running on `http://127.0.0.1:5555`
- Postman installed

## Testing Steps

1. **Register Driver**
   - Send a POST request to `http://127.0.0.1:5555/register` with the following JSON payload:
     ```json
     {
       "username": "driver_username",
       "email": "driver@example.com",
       "password": "driver_password",
       "role": "driver"
     }
     ```
   - Note the `token` value in the response.

2. **Login Driver**
   - Send a POST request to `http://127.0.0.1:5555/login` with the following JSON payload:
     ```json
     {
       "email": "driver@example.com",
       "password": "driver_password"
     }
     ```
   - Note the `token` value in the response.

3. **Create Bus**
   - Send a POST request to `http://127.0.0.1:5555/buses` with the following JSON payload and the `token` from the previous step in the `Authorization` header as `Bearer <token>`:
     ```json
     {
       "company_name": "GoBus",
       "number_plate": "ABC123",
       "no_of_seats": 30,
       "cost_per_seat": 100,
       "route": "City A - City B",
       "boarding_point": "City A",
       "destination": "City B",
       "departure_time": "2023-06-01T10:00:00",
       "arrival_time": "2023-06-01T14:00:00"
     }
     ```

4. **Register Passenger**
   - Send a POST request to `http://127.0.0.1:5555/register` with the following JSON payload:
     ```json
     {
       "username": "passenger_username",
       "email": "passenger@example.com",
       "password": "passenger_password",
       "role": "passenger"
     }
     ```
   - Note the `token` value in the response.

5. **Login Passenger**
   - Send a POST request to `http://127.0.0.1:5555/login` with the following JSON payload:
     ```json
     {
       "email": "passenger@example.com",
       "password": "passenger_password"
     }
     ```
   - Note the `token` value in the response.

6. **Get Available Seats**
   - Send a GET request to `http://127.0.0.1:5555/buses/1/seats` with the `token` from the previous step in the `Authorization` header as `Bearer <token>`.
   - This will return a list of available seat numbers for the bus with ID 1.

7. **Book Seat**
   - Send a POST request to `http://127.0.0.1:5555/buses/1/book` with the following JSON payload and the `token` from the previous step in the `Authorization` header as `Bearer <token>`:
     ```json
     {
       "seat_number": 10
     }
     ```
   - Note the `booking_id` value in the response.

8. **Update Booking**
   - Send a PUT request to `http://127.0.0.1:5555/bookings/1` (replace 1 with the `booking_id` from the previous step) with the following JSON payload and the `token` from the passenger login step in the `Authorization` header as `Bearer <token>`:
     ```json
     {
       "seat_number": 15
     }
     ```

9. **Delete Booking**
   - Send a DELETE request to `http://127.0.0.1:5555/bookings/1` (replace 1 with the `booking_id` from step 7) with the `token` from the passenger login step in the `Authorization` header as `Bearer <token>`.
