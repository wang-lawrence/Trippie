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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from '../components/ui/popover';
import { useState } from 'react';
import { updateTrip, TripEvents } from '../lib/data';
import { Link, useNavigate } from 'react-router-dom';

const FormSchema = z.object({
  tripName: z.string().min(1, {
    message: 'Trip name is a required field.',
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
  editTrip: Partial<TripEvents>;
};

export default function TripEditForm({ editTrip }: Props) {
  const [error, setError] = useState<unknown>();
  const navigate = useNavigate();
  const { tripId, tripName, startDate, endDate, iconUrl } = editTrip;

  const defaultValues: Partial<TripFormValues> = {
    tripName,
    startDate,
    endDate,
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
    mode: 'onChange',
  });

  // send updated form data to database
  async function onSubmit(data: TripFormValues) {
    try {
      await updateTrip({ ...data, tripId: Number(tripId), iconUrl });
    } catch (error) {
      setError(error);
    } finally {
      navigate(`/saved-trips/trip-details/${tripId}`);
    }
  }

  if (error)
    return (
      <h1>{`${error instanceof Error ? error.message : 'Unknwon Error'}`}</h1>
    );

  // form code from shadcn component library
  return (
    <div className="bg-img">
      <div className="container">
        <div className="mt-6 lg:mt-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="tripName"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-center">
                      <FormLabel className="roboto text-lg md:text-xl">
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
                      <FormLabel className="roboto text-lg md:text-xl">
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
                        <PopoverContent
                          className="w-auto p-0 relative"
                          align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            numberOfMonths={1}
                            pagedNavigation
                            initialFocus
                          />
                          <PopoverClose className="absolute bottom-3 right-5">
                            <Button className="h-7">Done</Button>
                          </PopoverClose>
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
                      <FormLabel className="robot text-lg md:text-xl">
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
                        <PopoverContent
                          className="w-auto p-0 relative"
                          align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            numberOfMonths={1}
                            pagedNavigation
                            initialFocus
                          />
                          <PopoverClose className="absolute bottom-3 right-5">
                            <Button className="h-7">Done</Button>
                          </PopoverClose>
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
                <Link to={`/saved-trips/trip-details/${tripId}`}>
                  <Button
                    type="button"
                    className="roboto w-28 bg-gold text-lg mr-4">
                    Cancel
                  </Button>
                </Link>
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
