'use client';

import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { Eden } from '@/eden';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";


export default function BillingPage() {
  // getEden();
  const { data: session } = useSession({
    required: true,
  });
  const [resp, setResp] = useState<any>();
  const [subs, setSubs] = useState<any[]>([]);
  const [me, setMe] = useState<any>();
  

  const upgrade = (customerId: string, planId: string) => {
    Eden.upgrade.post({
      customerId,
      planId,
    });
  }


  useEffect(() => {
    const sess = session as (typeof session & { id: string }) | null;
    console.log(sess);
    if (sess?.id) {
      Eden.me.post({
        id: sess.id,
      }).then(resp => {
        console.log(resp);
        setMe(resp.data);
      })
      Eden.plans.get().then(resp => {
        if (resp.data) {
          setSubs(resp.data);
        }
      });
    }
  }, [session]);

  return (
    <Box py={12}>
      <Flex>
        <Card>
          <CardHeader><Text>{JSON.stringify(me)}</Text></CardHeader>
          <CardBody><Text>Your plan: {me?.subscriptions.length && me.subscriptions.at(0).billing_plan.plan_name}</Text></CardBody>
        </Card>
      </Flex>
      <Flex>
        <VStack>
          <Flex>
            <Text>Upgrade</Text>
          </Flex>
          <HStack>
            {subs?.map((sub) => (
              <Flex>
                <Card>
                  <CardHeader><Text>{sub.plan_name}</Text></CardHeader>
                  <CardBody>
                    <VStack>
                      {sub.versions.at(0).components.at(0).tiers.map((tier) => (
                        <Text>{tier.range_start} - {tier.range_end} {sub.versions.at(0).components.at(0).pricing_unit.symbol}{tier.cost_per_batch}/SMS</Text>
                      ))}
                    </VStack>
                  </CardBody>
                  <CardFooter>{me?.subscriptions.length && me.subscriptions.at(0).billing_plan.plan_id !== sub.plan_id ? <Button onClick={() => upgrade(me.customer_id, sub.plan_id)}>Upgrade</Button> : <Button disabled={true} style={{ backgroundColor: 'gray.100' }}>Got</Button>}</CardFooter>
                </Card>
              </Flex>
            ))}
          </HStack>
        </VStack>
      </Flex>
    </Box>
  )
}