'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AddUserButtonProps {
  revalidateAction?: () => Promise<void>;
}

export default function AddUserButton({
  revalidateAction,
}: AddUserButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <>
      {/* We'll implement the dialog directly here since we had issues with the import */}
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account. Fill in all the required fields.
              </DialogDescription>
            </DialogHeader>
            <div className='py-4'>
              <p>User creation form will be implemented here.</p>
              <p className='text-sm text-muted-foreground'>
                This is a placeholder. The actual form will be implemented in a
                separate component.
              </p>
            </div>
            <DialogFooter>
              <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  setIsDialogOpen(false);
                  if (revalidateAction) {
                    await revalidateAction();
                  }
                }}
              >
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
