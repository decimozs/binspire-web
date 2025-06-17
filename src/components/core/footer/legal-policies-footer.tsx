import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useState } from "react";

const PrivacyPolicy = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="underline cursor-pointer">Privacy Policy</span>
      </DialogTrigger>
      <DialogContent className="p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Privacy Policy
          </DialogTitle>
          <DialogDescription asChild>
            <div className="overflow-y-auto px-6 py-4 space-y-4 text-sm">
              <p>
                <strong>Data Collection</strong>
                <br />
                We collect personal data (e.g., name, email, usage data) to
                provide and improve our services.
              </p>
              <p>
                <strong>Use of Data</strong>
                <br />
                We use your data to operate the website, communicate with users,
                and enhance user experience.
              </p>
              <p>
                <strong>Data Sharing</strong>
                <br />
                We do not sell or share your personal data with third parties,
                except as required by law.
              </p>
              <p>
                <strong>User Rights</strong>
                <br />
                You have the right to access, update, or delete your data.
                Contact us for any data-related concerns.
              </p>
              <p>
                <strong>Cookies</strong>
                <br />
                This website may use cookies for functionality and analytics.
                You may disable cookies in your browser.
              </p>
              <p>
                <strong>Updates</strong>
                <br />
                We may update this policy from time to time. Continued use of
                our site constitutes acceptance.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TermsOfService = () => {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const scrollPercentage =
      viewport.scrollTop / (viewport.scrollHeight - viewport.clientHeight);
    if (scrollPercentage >= 0.99 && !hasReadToBottom) {
      setHasReadToBottom(true);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="underline cursor-pointer">Terms of Service</span>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Terms & Conditions
          </DialogTitle>
          <ScrollArea
            className="flex max-h-full flex-col overflow-hidden"
            onScroll={handleScroll}
            ref={viewportRef}
          >
            <DialogDescription asChild>
              <div className="px-6 py-4">
                <div className="[&_strong]:text-foreground space-y-4 [&_strong]:font-semibold">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p>
                        <strong>Acceptance of Terms</strong>
                      </p>
                      <p>
                        By accessing and using this website, users agree to
                        comply with and be bound by these Terms of Service.
                        Users who do not agree with these terms should
                        discontinue use of the website immediately.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p>
                        <strong>User Account Responsibilities</strong>
                      </p>
                      <p>
                        Users are responsible for maintaining the
                        confidentiality of their account credentials. Any
                        activities occurring under a user&lsquo;s account are
                        the sole responsibility of the account holder. Users
                        must notify the website administrators immediately of
                        any unauthorized account access.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p>
                        <strong>Content Usage and Restrictions</strong>
                      </p>
                      <p>
                        The website and its original content are protected by
                        intellectual property laws. Users may not reproduce,
                        distribute, modify, create derivative works, or
                        commercially exploit any content without explicit
                        written permission from the website owners.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p>
                        <strong>Limitation of Liability</strong>
                      </p>
                      <p>
                        The website provides content &ldquo;as is&ldquo; without
                        any warranties. The website owners shall not be liable
                        for direct, indirect, incidental, consequential, or
                        punitive damages arising from user interactions with the
                        platform.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p>
                        <strong>User Conduct Guidelines</strong>
                      </p>
                      <ul className="list-disc pl-6">
                        <li>Not upload harmful or malicious content</li>
                        <li>Respect the rights of other users</li>
                        <li>
                          Avoid activities that could disrupt website
                          functionality
                        </li>
                        <li>
                          Comply with applicable local and international laws
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-1">
                      <p>
                        <strong>Modifications to Terms</strong>
                      </p>
                      <p>
                        The website reserves the right to modify these terms at
                        any time. Continued use of the website after changes
                        constitutes acceptance of the new terms.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p>
                        <strong>Termination Clause</strong>
                      </p>
                      <p>
                        The website may terminate or suspend user access without
                        prior notice for violations of these terms or for any
                        other reason deemed appropriate by the administration.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p>
                        <strong>Governing Law</strong>
                      </p>
                      <p>
                        These terms are governed by the laws of the jurisdiction
                        where the website is primarily operated, without regard
                        to conflict of law principles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </ScrollArea>
        </DialogHeader>
        <DialogFooter className="border-t px-6 py-4 sm:items-center">
          {!hasReadToBottom && (
            <span className="text-muted-foreground grow text-xs max-sm:text-center">
              Read all terms before accepting.
            </span>
          )}
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" disabled={!hasReadToBottom}>
              I agree
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function LegalPoliciesFooter() {
  return (
    <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
      By clicking continue, you agree to our <TermsOfService /> and{" "}
      <PrivacyPolicy />.
    </div>
  );
}
