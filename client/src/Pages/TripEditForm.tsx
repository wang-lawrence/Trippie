'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { Input } from '../components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
// import { toast } from "@/src/components/ui/use-toast"
import { useState, useEffect } from 'react';
import { getTrip, updateTrip, TripEntry } from '../lib/data';
import { useNavigate, useParams } from 'react-router-dom';
import useFindTrip from '../hooks/useFindTrip';

const FormSchema = z.object({
  tripName: z.string({
    required_error: 'Trip name is a required field.',
  }),
  startDate: z.date({
    required_error: 'A start date is required.',
  }),
  endDate: z.date({
    required_error: 'An end date is required.',
  }),
});

type TripFormValues = z.infer<typeof FormSchema>;

type Props = {
  editTrip: TripEntry;
};

export default function TripEditForm({ editTrip }: Props) {
  // const {tripId} = useParams();
  // const [tripName, setTripName] = useState<string | undefined>();
  // const [startDate, setStartDate] = useState<Date | undefined>();
  // const [endDate, setEndDate] = useState<Date | undefined>();
  const navigate = useNavigate();
  const { tripId, tripName, startDate, endDate } = editTrip;

  const defaultValues: Partial<TripFormValues> = {
    tripName,
    startDate,
    endDate,
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
    // use 'mode: "onChange"' for edit entry form,
  });

  // send form data to database
  // it looks awkward selecting icon url in the first page, so just add a random icon url link with submission
  async function onSubmit(data: TripFormValues) {
    try {
      await updateTrip(data, 1, Number(tripId));
    } catch (error) {
      console.error('Error editing trip', error);
    } finally {
      navigate(`/trip-details/${tripId}`);
    }
  }

  return (
    <div className="bg-img">
      <div className="container">
        <div className="mt-10 lg:mt-14">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="tripName"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-center">
                      <FormLabel className="roboto md:text-xl">
                        Trip Name
                      </FormLabel>
                    </div>
                    <div className="flex justify-center">
                      <FormControl>
                        <Input
                          className="w-[280px]"
                          placeholder="Enter trip name"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <div className="flex justify-center">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="flex justify-center">
                      <FormLabel className="roboto md:text-xl">
                        Start Date
                      </FormLabel>
                    </div>
                    <div className="flex justify-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[280px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}>
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            numberOfMonths={1}
                            pagedNavigation
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex justify-center">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div className="flex justify-center">
                      <FormLabel className="robot md:text-xl">
                        End Date
                      </FormLabel>
                    </div>
                    <div className="flex justify-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-[280px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}>
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            numberOfMonths={1}
                            pagedNavigation
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex justify-center">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button
                  type="button"
                  className="roboto w-28 bg-gold text-lg mr-4">
                  Cancel
                </Button>
                <Button type="submit" className="roboto w-28 bg-gold text-lg">
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
